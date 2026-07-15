import { Injectable } from '@angular/core';
import {
    ClientProfile,
    ClientRecord,
    mapClientRecord,
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
            `/clients?slug=eq.${encodeURIComponent(normalizedSlug)}&active=eq.true&select=id,slug,name,last_name,instagram,whatsapp,pix_key,facebook,store_url,catalog_url,avatar_url,background_url,theme,active&limit=1`
        );

        const clientRecord = clients[0];

        if (!clientRecord) {
            return null;
        }

        return mapClientRecord(clientRecord);
    }
}
