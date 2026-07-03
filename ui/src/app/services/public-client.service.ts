import { Injectable } from '@angular/core';
import {
    ClientLinkRecord,
    ClientProfile,
    ClientRecord,
    mapClientRecord,
    mapLinkRecord,
    normalizeSlug
} from '../domain/client.models';
import { SupabaseApiService } from './supabase-api.service';

@Injectable({ providedIn: 'root' })
export class PublicClientService {
    constructor(private readonly supabase: SupabaseApiService) { }

    get isConfigured(): boolean {
        return this.supabase.isConfigured;
    }

    async getBySlug(slug: string): Promise<ClientProfile | null> {
        const normalizedSlug = normalizeSlug(slug);
        const clients = await this.supabase.get<ClientRecord[]>(
            `/clients?slug=eq.${encodeURIComponent(normalizedSlug)}&active=eq.true&select=id,slug,name,subtitle,pix_key,avatar_url,logo_url,background_url,theme,active&limit=1`
        );

        const clientRecord = clients[0];

        if (!clientRecord) {
            return null;
        }

        const links = await this.supabase.get<ClientLinkRecord[]>(
            `/client_links?client_id=eq.${encodeURIComponent(clientRecord.id)}&active=eq.true&select=id,client_id,title,type,value,icon,sort_order,active&order=sort_order.asc`
        );

        return mapClientRecord(clientRecord, links.map(mapLinkRecord));
    }
}
