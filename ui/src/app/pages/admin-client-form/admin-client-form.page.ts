import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientAssetKind, ClientInput, ClientProfile, ClientTheme, DEFAULT_CLIENT_THEME, normalizeSlug, nullIfEmpty } from '../../domain/client.models';
import { AdminClientService } from '../../services/admin-client.service';
import { AssetUploadService } from '../../services/asset-upload.service';
import { SupabaseConfigurationError } from '../../services/supabase-api.service';

interface ClientDraft {
    id: string | null; name: string; lastName: string; slug: string; instagram: string;
    whatsapp: string; pixKey: string; facebook: string; storeUrl: string; catalogUrl: string;
    avatarUrl: string; backgroundUrl: string; active: boolean; theme: ClientTheme;
}

@Component({
    selector: 'app-admin-client-form', standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-client-form.page.html', styleUrl: './admin-client-form.page.scss'
})
export class AdminClientFormPage implements OnInit {
    protected draft: ClientDraft = this.emptyDraft();
    protected activeTab: 'data' | 'appearance' = 'data';
    protected loading = false; protected saving = false; protected errorMessage = ''; protected successMessage = '';
    protected uploading: Record<ClientAssetKind, boolean> = { avatar: false, background: false };

    constructor(private readonly route: ActivatedRoute, private readonly router: Router,
        private readonly adminClients: AdminClientService, private readonly assetUpload: AssetUploadService) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) void this.loadClient(id);
    }

    protected get isNew(): boolean { return this.draft.id === null; }

    protected generateSlug(): void {
        this.draft.slug = normalizeSlug(`${this.draft.name} ${this.draft.lastName}`);
    }

    protected formatWhatsapp(): void {
        const digits = this.draft.whatsapp.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '').slice(0, 11);
        if (digits.length <= 2) this.draft.whatsapp = digits;
        else this.draft.whatsapp = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    protected async save(): Promise<void> {
        this.errorMessage = ''; this.successMessage = '';
        const validationError = this.validate();
        if (validationError) { this.errorMessage = validationError; return; }
        this.saving = true;
        try {
            const wasNew = this.isNew;
            const saved = wasNew
                ? await this.adminClients.createClient(this.toClientInput())
                : await this.adminClients.updateClient(this.draft.id ?? '', this.toClientInput());
            this.applyClient(saved);
            this.successMessage = 'Cliente salvo e publicado.';
            if (wasNew) await this.router.navigate(['/admin/clients', saved.id], { replaceUrl: true });
        } catch (error) {
            this.errorMessage = error instanceof SupabaseConfigurationError
                ? 'Configure o Supabase nos environments antes de salvar.'
                : error instanceof Error ? error.message : 'Não foi possível salvar o cliente.';
        } finally { this.saving = false; }
    }

    protected async onFileSelected(kind: ClientAssetKind, event: Event): Promise<void> {
        const input = event.target as HTMLInputElement; const file = input.files?.[0]; input.value = '';
        if (!file) return;
        this.errorMessage = ''; this.uploading[kind] = true;
        try {
            const slug = this.draft.slug || normalizeSlug(`${this.draft.name} ${this.draft.lastName}`) || 'cliente';
            const url = await this.assetUpload.uploadClientAsset(slug, kind, file);
            if (kind === 'avatar') this.draft.avatarUrl = url; else this.draft.backgroundUrl = url;
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Não foi possível enviar a imagem.';
        } finally { this.uploading[kind] = false; }
    }

    private async loadClient(id: string): Promise<void> {
        this.loading = true;
        try {
            const client = await this.adminClients.getClient(id);
            if (client) this.applyClient(client); else this.errorMessage = 'Cliente não encontrado.';
        } catch (error) {
            this.errorMessage = error instanceof SupabaseConfigurationError ? 'Configure o Supabase antes de editar clientes.'
                : error instanceof Error ? error.message : 'Não foi possível carregar o cliente.';
        } finally { this.loading = false; }
    }

    private applyClient(client: ClientProfile): void {
        this.draft = {
            id: client.id, name: client.name, lastName: client.lastName, slug: client.slug,
            instagram: client.instagram ?? '', whatsapp: client.whatsapp ?? '', pixKey: client.pixKey ?? '',
            facebook: client.facebook ?? '', storeUrl: client.storeUrl ?? '', catalogUrl: client.catalogUrl ?? '',
            avatarUrl: client.avatarUrl ?? '', backgroundUrl: client.backgroundUrl ?? '', active: client.active,
            theme: { ...client.theme }
        };
        this.formatWhatsapp();
    }

    private validate(): string | null {
        this.draft.slug = normalizeSlug(this.draft.slug || `${this.draft.name} ${this.draft.lastName}`);
        if (!this.draft.name.trim()) return 'Informe o nome do cliente.';
        if (!this.draft.lastName.trim()) return 'Informe o sobrenome do cliente.';
        if (!this.draft.avatarUrl.trim()) return 'Envie a foto de perfil do cliente.';
        if (!this.draft.slug) return 'Informe um slug válido.';
        const phone = this.draft.whatsapp.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
        if (phone && !/^\d{10,11}$/.test(phone)) return 'Informe o WhatsApp com DDD e 10 ou 11 dígitos.';
        return null;
    }

    private toClientInput(): ClientInput {
        return {
            slug: this.draft.slug, name: this.draft.name, lastName: this.draft.lastName,
            instagram: nullIfEmpty(this.draft.instagram), whatsapp: nullIfEmpty(this.draft.whatsapp),
            pixKey: nullIfEmpty(this.draft.pixKey), facebook: nullIfEmpty(this.draft.facebook),
            storeUrl: nullIfEmpty(this.draft.storeUrl), catalogUrl: nullIfEmpty(this.draft.catalogUrl),
            avatarUrl: this.draft.avatarUrl, backgroundUrl: nullIfEmpty(this.draft.backgroundUrl),
            active: this.draft.active, theme: { ...this.draft.theme }
        };
    }

    private emptyDraft(): ClientDraft {
        return { id: null, name: '', lastName: '', slug: '', instagram: '', whatsapp: '', pixKey: '',
            facebook: '', storeUrl: '', catalogUrl: '', avatarUrl: '', backgroundUrl: '', active: true,
            theme: { ...DEFAULT_CLIENT_THEME } };
    }
}
