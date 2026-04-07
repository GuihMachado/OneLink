import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlbum, lucideAlertTriangle, lucideCheck, lucideCopy, lucideFileUp, lucideInstagram, lucideMessageCircle, lucideMessageCirclePlus, lucideMoreVertical, lucidePlus, lucideQrCode, lucideSearch, lucideShare2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HlmIconImports,
        HlmSeparatorImports,
        HlmButtonImports,
        HlmDropdownMenuImports,
        HlmButtonGroupImports,
        ClipboardModule,
        MatRippleModule
    ],
    providers: [
        provideIcons({ lucideSearch, lucidePlus, lucideFileUp, lucideInstagram, lucideMoreVertical, lucideQrCode, lucideAlbum, lucideCheck, lucideCopy, lucideShare2, lucideMessageCircle, lucideMessageCirclePlus })
    ],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss'
})
export class HomePage {
    protected chavePixVanessa: string = '15996114538';
    protected chavePixDemerino: string = '48999696338';
    protected copiado: boolean = false;
    protected redirectTo(to: string) {
        if (to === 'wpp-vanessa') {
            window.open(`https://wa.me/5515996114538?text=Olá!`, '_blank');
        }else if (to === 'wpp-demerino') {
            window.open(`https://wa.me/5548999696338?text=Olá!`, '_blank');
        }
    }

    onCopySuccess() {
        this.copiado = true;
        setTimeout(() => {
            this.copiado = false;
        }, 2000);
    }
}
