import { Injectable } from '@angular/core';
import { ClientAssetKind, normalizeSlug } from '../domain/client.models';
import { AuthService } from './auth.service';
import { SupabaseApiService } from './supabase-api.service';

@Injectable({ providedIn: 'root' })
export class AssetUploadService {
    constructor(
        private readonly supabase: SupabaseApiService,
        private readonly auth: AuthService
    ) { }

    async uploadClientAsset(slug: string, kind: ClientAssetKind, file: File): Promise<string> {
        const token = this.auth.getAccessToken();

        if (!token) {
            throw new Error('Faça login novamente para enviar imagens.');
        }

        const normalizedSlug = normalizeSlug(slug);

        if (!normalizedSlug) {
            throw new Error('Preencha o slug do cliente antes de enviar imagens.');
        }

        const path = `${normalizedSlug}/${kind}-${Date.now()}.${this.extensionFor(file)}`;
        await this.supabase.uploadObject(this.supabase.bucketName, path, file, token);

        return this.supabase.getPublicObjectUrl(this.supabase.bucketName, path);
    }

    private extensionFor(file: File): string {
        const nameExtension = file.name.split('.').pop()?.toLowerCase();

        if (nameExtension) {
            return nameExtension;
        }

        if (file.type === 'image/png') {
            return 'png';
        }

        if (file.type === 'image/webp') {
            return 'webp';
        }

        return 'jpg';
    }
}
