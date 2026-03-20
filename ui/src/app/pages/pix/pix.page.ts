import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlbum, lucideAlertTriangle, lucideChevronLeft, lucideFileUp, lucideInstagram, lucideMoreVertical, lucidePlus, lucideQrCode, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
    selector: 'app-pix',
    standalone: true,
    imports: [
        HlmIconImports,
        HlmSeparatorImports,
        HlmButtonImports,
        HlmDropdownMenuImports,
        HlmButtonGroupImports
    ],
    providers: [
        provideIcons({ lucideSearch, lucidePlus, lucideFileUp, lucideInstagram, lucideMoreVertical, lucideQrCode, lucideAlbum, lucideChevronLeft })
    ],
    templateUrl: './pix.page.html',
    styleUrl: './pix.page.scss'
})
export class PixPage {
    
}
