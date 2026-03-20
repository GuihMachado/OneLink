import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlbum, lucideAlertTriangle, lucideFileUp, lucideInstagram, lucideMoreVertical, lucidePlus, lucideQrCode, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HlmIconImports,
        HlmSeparatorImports,
        HlmButtonImports,
        HlmDropdownMenuImports,
        HlmButtonGroupImports
    ],
    providers: [
        provideIcons({ lucideSearch, lucidePlus, lucideFileUp, lucideInstagram, lucideMoreVertical, lucideQrCode, lucideAlbum })
    ],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss'
})
export class HomePage {
    protected redirectTo(to: string) {
        if (to === 'instagram') {
            window.open(`https://www.instagram.com/renatamartho/`, '_blank');
        }else if (to === 'pix') {
            window.open(`https://www.pix.com/`, '_blank');
        }else{
            window.open(`https://loja.marykay.com.br/minha-vitrine?slug=renata-martho-consultora-mary-kay&fbclid=PAY2xjawGx2TNleHRuA2FlbQIxMQABphjH077_ECt3pAZAMdfFA20ZhsrmXZCaLOPAv0uCI8hi-6SqpDsaBIzChw_aem_BgylQnxgkzR25asAM4Ownw`, '_blank');
        }
    }
}
