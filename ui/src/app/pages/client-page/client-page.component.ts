import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
    lucideAlbum,
    lucideAlertTriangle,
    lucideCopy,
    lucideExternalLink,
    lucideInstagram,
    lucideLink,
    lucideMessageCircle,
    lucideQrCode
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { ClientLink, ClientProfile } from '../../domain/client.models';
import { PublicClientService } from '../../services/public-client.service';
import { SupabaseConfigurationError } from '../../services/supabase-api.service';

type PageState = 'loading' | 'ready' | 'missing' | 'not-configured' | 'error';

const ICON_MAP: Record<string, string> = {
    instagram: 'lucideInstagram',
    whatsapp: 'lucideMessageCircle',
    pix: 'lucideQrCode',
    loja: 'lucideAlbum',
    shop: 'lucideAlbum',
    copy: 'lucideCopy',
    link: 'lucideExternalLink'
};

@Component({
    selector: 'app-client-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatRippleModule,
        HlmIconImports
    ],
    providers: [
        provideIcons({
            lucideAlbum,
            lucideAlertTriangle,
            lucideCopy,
            lucideExternalLink,
            lucideInstagram,
            lucideLink,
            lucideMessageCircle,
            lucideQrCode
        })
    ],
    templateUrl: './client-page.component.html',
    styleUrl: './client-page.component.scss'
})
export class ClientPageComponent implements OnInit {
    protected state: PageState = 'loading';
    protected client: ClientProfile | null = null;
    protected copiedLinkId: string | null = null;
    protected errorMessage = '';

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly route: ActivatedRoute,
        private readonly publicClients: PublicClientService,
        private readonly clipboard: Clipboard
    ) { }

    ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                void this.loadClient(params.get('clientSlug') ?? '');
            });
    }

    protected activateLink(link: ClientLink): void {
        if (link.type === 'copy') {
            this.clipboard.copy(link.value);
            this.copiedLinkId = link.id;
            window.setTimeout(() => {
                if (this.copiedLinkId === link.id) {
                    this.copiedLinkId = null;
                }
            }, 2000);
            return;
        }

        window.open(link.value, '_blank', 'noopener');
    }

    protected iconFor(link: ClientLink): string {
        if (link.icon && ICON_MAP[link.icon]) {
            return ICON_MAP[link.icon];
        }

        if (link.type === 'copy') {
            return 'lucideCopy';
        }

        return 'lucideLink';
    }

    protected backgroundImage(profile: ClientProfile): string {
        if (!profile.backgroundUrl) {
            return 'none';
        }

        return `linear-gradient(rgba(0,0,0,0.32), rgba(0,0,0,0.42)), url("${profile.backgroundUrl}")`;
    }

    private async loadClient(slug: string): Promise<void> {
        this.state = 'loading';
        this.client = null;
        this.errorMessage = '';

        try {
            const client = await this.publicClients.getBySlug(slug);

            if (!client) {
                this.state = 'missing';
                return;
            }

            this.client = client;
            this.state = 'ready';
        } catch (error) {
            if (error instanceof SupabaseConfigurationError) {
                this.state = 'not-configured';
                return;
            }

            this.errorMessage = error instanceof Error ? error.message : 'Não foi possível carregar essa página.';
            this.state = 'error';
        }
    }
}
