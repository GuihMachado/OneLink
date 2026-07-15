import { Injectable } from '@angular/core';
import {
    ClientInput,
    ClientProfile,
    ClientRecord,
    mapClientRecord,
    toClientPayload
} from '../domain/client.models';
import { AuthService } from './auth.service';
import { SupabaseApiService } from './supabase-api.service';

@Injectable({ providedIn: 'root' })
export class AdminClientService {
    constructor(
        private readonly supabase: SupabaseApiService,
        private readonly auth: AuthService
    ) { }

    async listClients(): Promise<ClientProfile[]> {
        const clients = await this.supabase.get<ClientRecord[]>(
            '/clients?select=id,slug,name,last_name,instagram,whatsapp,pix_key,facebook,store_url,catalog_url,avatar_url,background_url,theme,active&order=name.asc',
            this.requireToken()
        );

        return clients.map((client) => mapClientRecord(client));
    }

    async getClient(id: string): Promise<ClientProfile | null> {
        const clients = await this.supabase.get<ClientRecord[]>(
            `/clients?id=eq.${encodeURIComponent(id)}&select=id,slug,name,last_name,instagram,whatsapp,pix_key,facebook,store_url,catalog_url,avatar_url,background_url,theme,active&limit=1`,
            this.requireToken()
        );

        return clients[0] ? mapClientRecord(clients[0]) : null;
    }

    async createClient(input: ClientInput): Promise<ClientProfile> {
        const records = await this.supabase.post<ClientRecord[]>(
            '/clients',
            toClientPayload(input),
            this.requireToken()
        );

        return mapClientRecord(records[0]);
    }

    async updateClient(id: string, input: ClientInput): Promise<ClientProfile> {
        const records = await this.supabase.patch<ClientRecord[]>(
            `/clients?id=eq.${encodeURIComponent(id)}`,
            toClientPayload(input),
            this.requireToken()
        );

        return mapClientRecord(records[0]);
    }

    private requireToken(): string {
        const token = this.auth.getAccessToken();

        if (!token) {
            throw new Error('Faça login novamente para continuar.');
        }

        return token;
    }
}
