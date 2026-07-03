import { Injectable } from '@angular/core';
import { SupabaseApiService } from './supabase-api.service';

interface StoredAdminSession {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    email: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly storageKey = 'onelink.admin.session';

    constructor(private readonly supabase: SupabaseApiService) { }

    get isConfigured(): boolean {
        return this.supabase.isConfigured;
    }

    get email(): string | null {
        return this.readSession()?.email ?? null;
    }

    isAuthenticated(): boolean {
        return this.getAccessToken() !== null;
    }

    getAccessToken(): string | null {
        const session = this.readSession();

        if (!session) {
            return null;
        }

        if (session.expiresAt <= Date.now() + 30000) {
            this.signOut();
            return null;
        }

        return session.accessToken;
    }

    async signIn(email: string, password: string): Promise<void> {
        const response = await this.supabase.signInWithPassword(email, password);
        const session: StoredAdminSession = {
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            expiresAt: Date.now() + response.expires_in * 1000,
            email: response.user.email ?? email
        };

        window.localStorage.setItem(this.storageKey, JSON.stringify(session));
    }

    signOut(): void {
        window.localStorage.removeItem(this.storageKey);
    }

    private readSession(): StoredAdminSession | null {
        const rawValue = window.localStorage.getItem(this.storageKey);

        if (!rawValue) {
            return null;
        }

        try {
            return JSON.parse(rawValue) as StoredAdminSession;
        } catch {
            window.localStorage.removeItem(this.storageKey);
            return null;
        }
    }
}
