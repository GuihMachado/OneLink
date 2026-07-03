import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SupabaseConfigurationError } from '../../services/supabase-api.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './admin-login.page.html',
    styleUrl: './admin-login.page.scss'
})
export class AdminLoginPage implements OnInit {
    protected email = '';
    protected password = '';
    protected loading = false;
    protected errorMessage = '';

    constructor(
        private readonly auth: AuthService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        if (this.auth.isAuthenticated()) {
            void this.router.navigateByUrl(this.returnUrl);
        }
    }

    protected async signIn(): Promise<void> {
        this.errorMessage = '';

        if (!this.email.trim() || !this.password) {
            this.errorMessage = 'Informe e-mail e senha.';
            return;
        }

        this.loading = true;

        try {
            await this.auth.signIn(this.email.trim(), this.password);
            await this.router.navigateByUrl(this.returnUrl);
        } catch (error) {
            if (error instanceof SupabaseConfigurationError) {
                this.errorMessage = 'Configure o Supabase nos environments antes de entrar.';
            } else {
                this.errorMessage = 'Não foi possível entrar. Confira o e-mail e a senha.';
            }
        } finally {
            this.loading = false;
        }
    }

    private get returnUrl(): string {
        return this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin/clients';
    }
}
