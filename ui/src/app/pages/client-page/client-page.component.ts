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
    lucideFacebook,
    lucideInstagram,
    lucideLink,
    lucideMessageCircle,
    lucideQrCode
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DEFAULT_GLOBAL_APPEARANCE, GlobalAppearance, appearanceBackgroundImage } from '../../domain/appearance.models';
import { ClientLink, ClientProfile } from '../../domain/client.models';
import { AppearanceService } from '../../services/appearance.service';
import { PublicClientService } from '../../services/public-client.service';
import { SupabaseConfigurationError } from '../../services/supabase-api.service';

type PageState = 'loading' | 'ready' | 'missing' | 'not-configured' | 'error';

const ICON_MAP: Record<string, string> = {
    instagram: 'lucideInstagram',
    whatsapp: 'lucideMessageCircle',
    facebook: 'lucideFacebook',
    pix: 'lucideQrCode',
    loja: 'lucideAlbum',
    catalogo: 'lucideAlbum',
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
            lucideFacebook,
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
    protected appearance: GlobalAppearance = { ...DEFAULT_GLOBAL_APPEARANCE };
    protected copiedLinkId: string | null = null;
    protected errorMessage = '';

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly route: ActivatedRoute,
        private readonly publicClients: PublicClientService,
        private readonly appearances: AppearanceService,
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

    protected get backgroundImage(): string {
        return appearanceBackgroundImage(this.appearance);
    }

    protected get backgroundPosition(): string {
        return `${this.appearance.backgroundPositionX}% ${this.appearance.backgroundPositionY}%`;
    }

    private async loadClient(slug: string): Promise<void> {
        this.state = 'loading';
        this.client = null;
        this.errorMessage = '';

        try {
            const [client, appearance] = await Promise.all([
                this.publicClients.getBySlug(slug),
                this.appearances.getPublicAppearance()
            ]);

            if (!client) {
                this.state = 'missing';
                return;
            }

            this.client = client;
            this.appearance = appearance;
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
