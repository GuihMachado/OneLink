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
    protected chavePix: string = '00020101021126580014br.gov.bcb.pix...';
    protected copiado: boolean = false;
    protected redirectTo(to: string) {
        if (to === 'instagram') {
            window.open(`https://www.instagram.com/renatamartho/`, '_blank');
        }else if (to === 'pix') {
            window.open(`https://www.pix.com/`, '_blank');
        }else if (to === 'wpp-team') {
            window.open(`https://wa.me/5515997177434?text=Olá!+Gostaria+de+fazer+parte+do+seu+time`, '_blank');
        }else if (to === 'wpp') {
            window.open(`https://wa.me/5515997177434?text=Olá!`, '_blank');
        }else{
            window.open(`https://loja.marykay.com.br/minha-vitrine?slug=renata-martho-consultora-mary-kay&fbclid=PAY2xjawGx2TNleHRuA2FlbQIxMQABphjH077_ECt3pAZAMdfFA20ZhsrmXZCaLOPAv0uCI8hi-6SqpDsaBIzChw_aem_BgylQnxgkzR25asAM4Ownw`, '_blank');
        }
    }

    onCopySuccess() {
        this.copiado = true;
        setTimeout(() => {
            this.copiado = false;
        }, 2000);
    }
}
