import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
    DEFAULT_GLOBAL_APPEARANCE,
    GlobalAppearance,
    appearanceBackgroundImage
} from '../../domain/appearance.models';
import { AppearanceService } from '../../services/appearance.service';
import { AssetUploadService } from '../../services/asset-upload.service';
import { SupabaseConfigurationError } from '../../services/supabase-api.service';

@Component({
    selector: 'app-admin-appearance',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './admin-appearance.page.html',
    styleUrl: './admin-appearance.page.scss'
})
export class AdminAppearancePage implements OnInit {
    protected appearance: GlobalAppearance = { ...DEFAULT_GLOBAL_APPEARANCE };
    protected loading = true;
    protected saving = false;
    protected uploading = false;
    protected dragging = false;
    protected errorMessage = '';
    protected successMessage = '';

    constructor(
        private readonly appearances: AppearanceService,
        private readonly assetUpload: AssetUploadService
    ) { }

    ngOnInit(): void {
        void this.loadAppearance();
    }

    protected get previewBackgroundImage(): string {
        return appearanceBackgroundImage(this.appearance);
    }

    protected get previewBackgroundPosition(): string {
        return `${this.appearance.backgroundPositionX}% ${this.appearance.backgroundPositionY}%`;
    }

    protected async save(): Promise<void> {
        this.saving = true;
        this.errorMessage = '';
        this.successMessage = '';
        try {
            this.appearance = await this.appearances.saveAppearance(this.appearance);
            this.successMessage = 'Aparência salva e aplicada a todos os clientes.';
        } catch (error) {
            this.errorMessage = this.messageFor(error, 'Não foi possível salvar a aparência.');
        } finally {
            this.saving = false;
        }
    }

    protected async onBackgroundSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;

        this.uploading = true;
        this.errorMessage = '';
        try {
            this.appearance.backgroundImageUrl = await this.assetUpload.uploadGlobalBackground(file);
            this.appearance.backgroundMode = 'image';
            this.centerImage();
        } catch (error) {
            this.errorMessage = this.messageFor(error, 'Não foi possível enviar a imagem.');
        } finally {
            this.uploading = false;
        }
    }

    protected startDragging(event: PointerEvent): void {
        if (this.appearance.backgroundMode !== 'image' || !this.appearance.backgroundImageUrl) return;
        const element = event.currentTarget as HTMLElement;
        element.setPointerCapture(event.pointerId);
        this.dragging = true;
        this.updateImagePosition(event, element);
    }

    protected moveImage(event: PointerEvent): void {
        if (!this.dragging) return;
        this.updateImagePosition(event, event.currentTarget as HTMLElement);
    }

    protected stopDragging(event: PointerEvent): void {
        const element = event.currentTarget as HTMLElement;
        if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
        this.dragging = false;
    }

    protected centerImage(): void {
        this.appearance.backgroundPositionX = 50;
        this.appearance.backgroundPositionY = 50;
    }

    private async loadAppearance(): Promise<void> {
        this.loading = true;
        try {
            this.appearance = await this.appearances.getAdminAppearance();
        } catch (error) {
            this.errorMessage = this.messageFor(error, 'Não foi possível carregar a aparência.');
        } finally {
            this.loading = false;
        }
    }

    private updateImagePosition(event: PointerEvent, element: HTMLElement): void {
        const rect = element.getBoundingClientRect();
        this.appearance.backgroundPositionX = this.percentage(event.clientX - rect.left, rect.width);
        this.appearance.backgroundPositionY = this.percentage(event.clientY - rect.top, rect.height);
    }

    private percentage(offset: number, total: number): number {
        if (total <= 0) return 50;
        return Math.round(Math.min(100, Math.max(0, (offset / total) * 100)) * 100) / 100;
    }

    private messageFor(error: unknown, fallback: string): string {
        if (error instanceof SupabaseConfigurationError) return 'Configure o Supabase antes de editar a aparência.';
        return error instanceof Error ? error.message : fallback;
    }
}
