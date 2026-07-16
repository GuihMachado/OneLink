import { Injectable } from '@angular/core';
import {
    DEFAULT_GLOBAL_APPEARANCE,
    GlobalAppearance,
    GlobalAppearanceRecord,
    mapGlobalAppearance,
    toGlobalAppearancePayload
} from '../domain/appearance.models';
import { AuthService } from './auth.service';
import { SupabaseApiService } from './supabase-api.service';

@Injectable({ providedIn: 'root' })
export class AppearanceService {
    constructor(private readonly supabase: SupabaseApiService, private readonly auth: AuthService) { }

    async getPublicAppearance(): Promise<GlobalAppearance> {
        const records = await this.supabase.get<GlobalAppearanceRecord[]>(
            '/global_appearance?id=eq.global&select=*&limit=1'
        );
        return records[0] ? mapGlobalAppearance(records[0]) : { ...DEFAULT_GLOBAL_APPEARANCE };
    }

    async getAdminAppearance(): Promise<GlobalAppearance> {
        const records = await this.supabase.get<GlobalAppearanceRecord[]>(
            '/global_appearance?id=eq.global&select=*&limit=1',
            this.requireToken()
        );
        return records[0] ? mapGlobalAppearance(records[0]) : { ...DEFAULT_GLOBAL_APPEARANCE };
    }

    async saveAppearance(appearance: GlobalAppearance): Promise<GlobalAppearance> {
        const records = await this.supabase.patch<GlobalAppearanceRecord[]>(
            '/global_appearance?id=eq.global',
            toGlobalAppearancePayload(appearance),
            this.requireToken()
        );
        return records[0] ? mapGlobalAppearance(records[0]) : appearance;
    }

    private requireToken(): string {
        const token = this.auth.getAccessToken();
        if (!token) throw new Error('Faça login novamente para continuar.');
        return token;
    }
}
