import { Injectable } from '@angular/core';
import {
    ClientInput,
    ClientLinkInput,
    ClientLinkRecord,
    ClientProfile,
    ClientRecord,
    mapClientRecord,
    mapLinkRecord,
    toClientLinkPayload,
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
            '/clients?select=id,slug,name,subtitle,pix_key,avatar_url,logo_url,background_url,theme,active&order=name.asc',
            this.requireToken()
        );

        return clients.map((client) => mapClientRecord(client));
    }

    async getClient(id: string): Promise<ClientProfile | null> {
        const clients = await this.supabase.get<ClientRecord[]>(
            `/clients?id=eq.${encodeURIComponent(id)}&select=id,slug,name,subtitle,pix_key,avatar_url,logo_url,background_url,theme,active&limit=1`,
            this.requireToken()
        );

        const clientRecord = clients[0];

        if (!clientRecord) {
            return null;
        }

        const links = await this.supabase.get<ClientLinkRecord[]>(
            `/client_links?client_id=eq.${encodeURIComponent(id)}&select=id,client_id,title,type,value,icon,sort_order,active&order=sort_order.asc`,
            this.requireToken()
        );

        return mapClientRecord(clientRecord, links.map(mapLinkRecord));
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

    async saveLinks(clientId: string, links: ClientLinkInput[], removedLinkIds: string[]): Promise<void> {
        const token = this.requireToken();

        for (const link of links) {
            const payload = toClientLinkPayload(clientId, link);

            if (link.id) {
                await this.supabase.patch<ClientLinkRecord[]>(
                    `/client_links?id=eq.${encodeURIComponent(link.id)}`,
                    payload,
                    token
                );
            } else {
                await this.supabase.post<ClientLinkRecord[]>('/client_links', payload, token);
            }
        }

        if (removedLinkIds.length > 0) {
            await this.supabase.patch<ClientLinkRecord[]>(
                `/client_links?id=in.(${removedLinkIds.map((id) => encodeURIComponent(id)).join(',')})`,
                { active: false },
                token
            );
        }
    }

    private requireToken(): string {
        const token = this.auth.getAccessToken();

        if (!token) {
            throw new Error('Faça login novamente para continuar.');
        }

        return token;
    }
}
