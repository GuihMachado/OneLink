import { Component, inject } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlertTriangle, lucideFileUp, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { HlmIconModule } from '@spartan-ng/ui-icon-helm';
import { BrnSeparatorModule } from '@spartan-ng/ui-separator-brain';
import { HlmSeparatorModule } from '@spartan-ng/ui-separator-helm';
import { HlmButtonModule } from '@spartan-ng/ui-button-helm';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HlmIconModule,
        BrnSeparatorModule,
        HlmSeparatorModule,
        HlmButtonModule,
    ],
    providers: [
        provideIcons({ lucideSearch, lucidePlus, lucideFileUp, lucideAlertTriangle })
    ],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss'
})
export class HomePage {
    
}
