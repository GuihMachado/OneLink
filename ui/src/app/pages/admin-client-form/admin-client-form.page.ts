import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    ClientAssetKind,
    ClientInput,
    ClientLinkInput,
    ClientLinkType,
    ClientProfile,
    ClientTheme,
    DEFAULT_CLIENT_THEME,
    normalizeSlug,
    nullIfEmpty
} from '../../domain/client.models';
import { AdminClientService } from '../../services/admin-client.service';
import { AssetUploadService } from '../../services/asset-upload.service';
import { SupabaseConfigurationError } from '../../services/supabase-api.service';

interface ClientDraft {
    id: string | null;
    name: string;
    slug: string;
    subtitle: string;
    pixKey: string;
    avatarUrl: string;
    logoUrl: string;
    backgroundUrl: string;
    active: boolean;
    theme: ClientTheme;
}

interface LinkDraft {
    id: string | null;
    title: string;
    type: ClientLinkType;
    value: string;
    icon: string;
    active: boolean;
}

@Component({
    selector: 'app-admin-client-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './admin-client-form.page.html',
    styleUrl: './admin-client-form.page.scss'
})
export class AdminClientFormPage implements OnInit {
    protected draft: ClientDraft = this.emptyDraft();
    protected links: LinkDraft[] = [];
    protected removedLinkIds: string[] = [];
    protected loading = false;
    protected saving = false;
    protected errorMessage = '';
    protected successMessage = '';
    protected uploading: Record<ClientAssetKind, boolean> = {
        avatar: false,
        logo: false,
        background: false
    };

    protected readonly iconOptions = [
        { value: 'link', label: 'Link' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'pix', label: 'Pix' },
        { value: 'loja', label: 'Loja' },
        { value: 'copy', label: 'Copiar' }
    ];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly adminClients: AdminClientService,
        private readonly assetUpload: AssetUploadService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            void this.loadClient(id);
        } else {
            this.addLink();
        }
    }

    protected get isNew(): boolean {
        return this.draft.id === null;
    }

    protected generateSlug(): void {
        this.draft.slug = normalizeSlug(this.draft.name || this.draft.slug);
    }

    protected addLink(type: ClientLinkType = 'url'): void {
        this.links.push({
            id: null,
            title: '',
            type,
            value: '',
            icon: type === 'copy' ? 'copy' : 'link',
            active: true
        });
    }

    protected removeLink(index: number): void {
        const [removed] = this.links.splice(index, 1);

        if (removed?.id) {
            this.removedLinkIds.push(removed.id);
        }
    }

    protected moveLink(index: number, direction: -1 | 1): void {
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= this.links.length) {
            return;
        }

        const current = this.links[index];
        this.links[index] = this.links[targetIndex];
        this.links[targetIndex] = current;
    }

    protected async save(): Promise<void> {
        this.errorMessage = '';
        this.successMessage = '';

        const validationError = this.validate();

        if (validationError) {
            this.errorMessage = validationError;
            return;
        }

        this.saving = true;

        try {
            const wasNew = this.isNew;
            const input = this.toClientInput();
            const savedClient = wasNew
                ? await this.adminClients.createClient(input)
                : await this.adminClients.updateClient(this.draft.id ?? '', input);

            this.draft.id = savedClient.id;

            await this.adminClients.saveLinks(savedClient.id, this.toLinkInputs(), this.removedLinkIds);
            const refreshedClient = await this.adminClients.getClient(savedClient.id);

            if (refreshedClient) {
                this.applyClient(refreshedClient);
            }

            this.removedLinkIds = [];
            this.successMessage = 'Cliente salvo e publicado.';

            if (wasNew) {
                await this.router.navigate(['/admin/clients', savedClient.id], { replaceUrl: true });
            }
        } catch (error) {
            if (error instanceof SupabaseConfigurationError) {
                this.errorMessage = 'Configure o Supabase nos environments antes de salvar.';
            } else {
                this.errorMessage = error instanceof Error ? error.message : 'Não foi possível salvar o cliente.';
            }
        } finally {
            this.saving = false;
        }
    }

    protected async onFileSelected(kind: ClientAssetKind, event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';

        if (!file) {
            return;
        }

        this.errorMessage = '';
        this.uploading[kind] = true;

        try {
            const url = await this.assetUpload.uploadClientAsset(this.draft.slug, kind, file);
            this.assignAssetUrl(kind, url);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Não foi possível enviar a imagem.';
        } finally {
            this.uploading[kind] = false;
        }
    }

    private async loadClient(id: string): Promise<void> {
        this.loading = true;
        this.errorMessage = '';

        try {
            const client = await this.adminClients.getClient(id);

            if (!client) {
                this.errorMessage = 'Cliente não encontrado.';
                return;
            }

            this.applyClient(client);
        } catch (error) {
            if (error instanceof SupabaseConfigurationError) {
                this.errorMessage = 'Configure o Supabase nos environments antes de editar clientes.';
            } else {
                this.errorMessage = error instanceof Error ? error.message : 'Não foi possível carregar o cliente.';
            }
        } finally {
            this.loading = false;
        }
    }

    private applyClient(client: ClientProfile): void {
        this.draft = {
            id: client.id,
            name: client.name,
            slug: client.slug,
            subtitle: client.subtitle ?? '',
            pixKey: client.pixKey ?? '',
            avatarUrl: client.avatarUrl ?? '',
            logoUrl: client.logoUrl ?? '',
            backgroundUrl: client.backgroundUrl ?? '',
            active: client.active,
            theme: { ...client.theme }
        };

        this.links = client.links.map((link) => ({
            id: link.id,
            title: link.title,
            type: link.type,
            value: link.value,
            icon: link.icon,
            active: link.active
        }));
    }

    private validate(): string | null {
        this.draft.slug = normalizeSlug(this.draft.slug || this.draft.name);

        if (!this.draft.name.trim()) {
            return 'Informe o nome do cliente.';
        }

        if (!this.draft.slug) {
            return 'Informe um slug válido.';
        }

        const invalidLink = this.links.find((link) => link.active && (!link.title.trim() || !link.value.trim()));

        if (invalidLink) {
            return 'Links ativos precisam de título e valor.';
        }

        return null;
    }

    private toClientInput(): ClientInput {
        return {
            slug: this.draft.slug,
            name: this.draft.name,
            subtitle: nullIfEmpty(this.draft.subtitle),
            pixKey: nullIfEmpty(this.draft.pixKey),
            avatarUrl: nullIfEmpty(this.draft.avatarUrl),
            logoUrl: nullIfEmpty(this.draft.logoUrl),
            backgroundUrl: nullIfEmpty(this.draft.backgroundUrl),
            theme: { ...this.draft.theme },
            active: this.draft.active
        };
    }

    private toLinkInputs(): ClientLinkInput[] {
        return this.links
            .filter((link) => link.title.trim() || link.value.trim())
            .map((link, index) => ({
                id: link.id,
                title: link.title,
                type: link.type,
                value: link.value,
                icon: link.icon,
                sortOrder: index,
                active: link.active
            }));
    }

    private assignAssetUrl(kind: ClientAssetKind, url: string): void {
        if (kind === 'avatar') {
            this.draft.avatarUrl = url;
        } else if (kind === 'logo') {
            this.draft.logoUrl = url;
        } else {
            this.draft.backgroundUrl = url;
        }
    }

    private emptyDraft(): ClientDraft {
        return {
            id: null,
            name: '',
            slug: '',
            subtitle: '',
            pixKey: '',
            avatarUrl: '',
            logoUrl: '',
            backgroundUrl: '',
            active: true,
            theme: { ...DEFAULT_CLIENT_THEME }
        };
    }
}
