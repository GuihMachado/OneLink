import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle, lucideFileUp, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HlmIconImports,
        HlmSeparatorImports,
        HlmButtonImports,
    ],
    providers: [
        provideIcons({ lucideSearch, lucidePlus, lucideFileUp, lucideAlertTriangle })
    ],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss'
})
export class HomePage {
    
}
