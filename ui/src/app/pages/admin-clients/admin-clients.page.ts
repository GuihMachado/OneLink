import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ClientProfile } from '../../domain/client.models';
import { AdminClientService } from '../../services/admin-client.service';
import { AuthService } from '../../services/auth.service';
import { SupabaseConfigurationError } from '../../services/supabase-api.service';

@Component({
    selector: 'app-admin-clients',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: './admin-clients.page.html',
    styleUrl: './admin-clients.page.scss'
})
export class AdminClientsPage implements OnInit {
    protected clients: ClientProfile[] = [];
    protected loading = true;
    protected errorMessage = '';

    constructor(
        protected readonly auth: AuthService,
        private readonly adminClients: AdminClientService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        void this.loadClients();
    }

    protected async loadClients(): Promise<void> {
        this.loading = true;
        this.errorMessage = '';

        try {
            this.clients = await this.adminClients.listClients();
        } catch (error) {
            if (error instanceof SupabaseConfigurationError) {
                this.errorMessage = 'Configure o Supabase nos environments antes de listar clientes.';
            } else {
                this.errorMessage = error instanceof Error ? error.message : 'Não foi possível listar clientes.';
            }
        } finally {
            this.loading = false;
        }
    }

    protected publicPath(client: ClientProfile): string {
        return `/${client.slug}`;
    }

    protected signOut(): void {
        this.auth.signOut();
        void this.router.navigate(['/admin/login']);
    }
}
