export type BackgroundMode = 'solid' | 'linear-gradient' | 'radial-gradient' | 'image';
export type BackgroundSize = 'cover' | 'contain' | 'auto';

export interface GlobalAppearance {
    backgroundMode: BackgroundMode;
    backgroundColor: string;
    gradientStartColor: string;
    gradientEndColor: string;
    gradientAngle: number;
    backgroundImageUrl: string | null;
    backgroundPositionX: number;
    backgroundPositionY: number;
    backgroundSize: BackgroundSize;
}

export interface GlobalAppearanceRecord {
    id: string;
    background_mode: BackgroundMode;
    background_color: string;
    gradient_start_color: string;
    gradient_end_color: string;
    gradient_angle: number;
    background_image_url: string | null;
    background_position_x: number;
    background_position_y: number;
    background_size: BackgroundSize;
}

export const DEFAULT_GLOBAL_APPEARANCE: GlobalAppearance = {
    backgroundMode: 'solid',
    backgroundColor: '#111827',
    gradientStartColor: '#111827',
    gradientEndColor: '#4f46e5',
    gradientAngle: 135,
    backgroundImageUrl: null,
    backgroundPositionX: 50,
    backgroundPositionY: 50,
    backgroundSize: 'cover'
};

export function mapGlobalAppearance(record: GlobalAppearanceRecord | null | undefined): GlobalAppearance {
    if (!record) return { ...DEFAULT_GLOBAL_APPEARANCE };
    return {
        backgroundMode: record.background_mode,
        backgroundColor: record.background_color,
        gradientStartColor: record.gradient_start_color,
        gradientEndColor: record.gradient_end_color,
        gradientAngle: record.gradient_angle,
        backgroundImageUrl: record.background_image_url,
        backgroundPositionX: record.background_position_x,
        backgroundPositionY: record.background_position_y,
        backgroundSize: record.background_size
    };
}

export function toGlobalAppearancePayload(appearance: GlobalAppearance): Omit<GlobalAppearanceRecord, 'id'> {
    return {
        background_mode: appearance.backgroundMode,
        background_color: appearance.backgroundColor,
        gradient_start_color: appearance.gradientStartColor,
        gradient_end_color: appearance.gradientEndColor,
        gradient_angle: clamp(appearance.gradientAngle, 0, 360),
        background_image_url: appearance.backgroundImageUrl?.trim() || null,
        background_position_x: clamp(appearance.backgroundPositionX, 0, 100),
        background_position_y: clamp(appearance.backgroundPositionY, 0, 100),
        background_size: appearance.backgroundSize
    };
}

export function appearanceBackgroundImage(appearance: GlobalAppearance): string {
    if (appearance.backgroundMode === 'linear-gradient') {
        return `linear-gradient(${appearance.gradientAngle}deg, ${appearance.gradientStartColor}, ${appearance.gradientEndColor})`;
    }
    if (appearance.backgroundMode === 'radial-gradient') {
        return `radial-gradient(circle, ${appearance.gradientStartColor}, ${appearance.gradientEndColor})`;
    }
    if (appearance.backgroundMode === 'image' && appearance.backgroundImageUrl) {
        return `url("${appearance.backgroundImageUrl.replace(/"/g, '%22')}")`;
    }
    return 'none';
}

function clamp(value: number, minimum: number, maximum: number): number {
    return Math.min(maximum, Math.max(minimum, Number.isFinite(value) ? value : minimum));
}
