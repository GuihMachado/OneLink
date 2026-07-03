import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export class SupabaseConfigurationError extends Error {
    constructor() {
        super('Configure environment.supabase.url e environment.supabase.anonKey antes de usar o OneLink.');
    }
}

export interface SupabasePasswordAuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: {
        id: string;
        email?: string;
    };
}

@Injectable({ providedIn: 'root' })
export class SupabaseApiService {
    constructor(private readonly http: HttpClient) { }

    get isConfigured(): boolean {
        const url = environment.supabase.url.trim();
        const anonKey = environment.supabase.anonKey.trim();

        return url.length > 0 && anonKey.length > 0;
    }

    get bucketName(): string {
        return environment.supabase.assetBucket;
    }

    async get<T>(path: string, accessToken?: string): Promise<T> {
        return firstValueFrom(
            this.http.get<T>(this.restUrl(path), {
                headers: this.restHeaders(accessToken)
            })
        );
    }

    async post<T>(path: string, body: unknown, accessToken?: string): Promise<T> {
        return firstValueFrom(
            this.http.post<T>(this.restUrl(path), body, {
                headers: this.restHeaders(accessToken, 'return=representation')
            })
        );
    }

    async patch<T>(path: string, body: unknown, accessToken?: string): Promise<T> {
        return firstValueFrom(
            this.http.patch<T>(this.restUrl(path), body, {
                headers: this.restHeaders(accessToken, 'return=representation')
            })
        );
    }

    async signInWithPassword(email: string, password: string): Promise<SupabasePasswordAuthResponse> {
        this.assertConfigured();

        return firstValueFrom(
            this.http.post<SupabasePasswordAuthResponse>(
                `${this.baseUrl}/auth/v1/token?grant_type=password`,
                { email, password },
                {
                    headers: new HttpHeaders({
                        apikey: environment.supabase.anonKey,
                        'Content-Type': 'application/json'
                    })
                }
            )
        );
    }

    async uploadObject(bucket: string, path: string, file: File, accessToken: string): Promise<void> {
        this.assertConfigured();

        const headers = new HttpHeaders({
            apikey: environment.supabase.anonKey,
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': file.type || 'application/octet-stream',
            'x-upsert': 'true'
        });

        await firstValueFrom(
            this.http.post(
                `${this.baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${this.encodePath(path)}`,
                file,
                { headers }
            )
        );
    }

    getPublicObjectUrl(bucket: string, path: string): string {
        this.assertConfigured();
        return `${this.baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${this.encodePath(path)}`;
    }

    private restUrl(path: string): string {
        this.assertConfigured();
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.baseUrl}/rest/v1${normalizedPath}`;
    }

    private restHeaders(accessToken?: string, prefer?: string): HttpHeaders {
        this.assertConfigured();

        let headers = new HttpHeaders({
            apikey: environment.supabase.anonKey,
            Authorization: `Bearer ${accessToken ?? environment.supabase.anonKey}`,
            'Content-Type': 'application/json'
        });

        if (prefer) {
            headers = headers.set('Prefer', prefer);
        }

        return headers;
    }

    private get baseUrl(): string {
        return environment.supabase.url.trim().replace(/\/$/, '');
    }

    private assertConfigured(): void {
        if (!this.isConfigured) {
            throw new SupabaseConfigurationError();
        }
    }

    private encodePath(path: string): string {
        return path.split('/').map((segment) => encodeURIComponent(segment)).join('/');
    }
}
