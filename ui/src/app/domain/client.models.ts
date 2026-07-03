export type ClientLinkType = 'url' | 'copy';
export type ClientAssetKind = 'avatar' | 'logo' | 'background';

export interface ClientTheme {
    backgroundColor: string;
    textColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    buttonBorderColor: string;
}

export interface ClientLink {
    id: string;
    clientId: string;
    title: string;
    type: ClientLinkType;
    value: string;
    icon: string;
    sortOrder: number;
    active: boolean;
}

export interface ClientProfile {
    id: string;
    slug: string;
    name: string;
    subtitle: string | null;
    pixKey: string | null;
    avatarUrl: string | null;
    logoUrl: string | null;
    backgroundUrl: string | null;
    theme: ClientTheme;
    active: boolean;
    links: ClientLink[];
}

export interface ClientInput {
    slug: string;
    name: string;
    subtitle: string | null;
    pixKey: string | null;
    avatarUrl: string | null;
    logoUrl: string | null;
    backgroundUrl: string | null;
    theme: ClientTheme;
    active: boolean;
}

export interface ClientLinkInput {
    id: string | null;
    title: string;
    type: ClientLinkType;
    value: string;
    icon: string;
    sortOrder: number;
    active: boolean;
}

export interface ClientRecord {
    id: string;
    slug: string;
    name: string;
    subtitle: string | null;
    pix_key: string | null;
    avatar_url: string | null;
    logo_url: string | null;
    background_url: string | null;
    theme: Partial<ClientTheme> | null;
    active: boolean;
}

export interface ClientLinkRecord {
    id: string;
    client_id: string;
    title: string;
    type: ClientLinkType;
    value: string;
    icon: string | null;
    sort_order: number;
    active: boolean;
}

export interface ClientPayload {
    slug: string;
    name: string;
    subtitle: string | null;
    pix_key: string | null;
    avatar_url: string | null;
    logo_url: string | null;
    background_url: string | null;
    theme: ClientTheme;
    active: boolean;
}

export interface ClientLinkPayload {
    client_id: string;
    title: string;
    type: ClientLinkType;
    value: string;
    icon: string | null;
    sort_order: number;
    active: boolean;
}

export const DEFAULT_CLIENT_THEME: ClientTheme = {
    backgroundColor: '#111827',
    textColor: '#ffffff',
    buttonBackgroundColor: '#ffffff',
    buttonTextColor: '#111827',
    buttonBorderColor: 'rgba(255,255,255,0.4)'
};

export function normalizeClientTheme(theme: Partial<ClientTheme> | null | undefined): ClientTheme {
    return {
        ...DEFAULT_CLIENT_THEME,
        ...(theme ?? {})
    };
}

export function mapClientRecord(record: ClientRecord, links: ClientLink[] = []): ClientProfile {
    return {
        id: record.id,
        slug: record.slug,
        name: record.name,
        subtitle: record.subtitle,
        pixKey: record.pix_key,
        avatarUrl: record.avatar_url,
        logoUrl: record.logo_url,
        backgroundUrl: record.background_url,
        theme: normalizeClientTheme(record.theme),
        active: record.active,
        links
    };
}

export function mapLinkRecord(record: ClientLinkRecord): ClientLink {
    return {
        id: record.id,
        clientId: record.client_id,
        title: record.title,
        type: record.type,
        value: record.value,
        icon: record.icon ?? '',
        sortOrder: record.sort_order,
        active: record.active
    };
}

export function toClientPayload(input: ClientInput): ClientPayload {
    return {
        slug: normalizeSlug(input.slug),
        name: input.name.trim(),
        subtitle: nullIfEmpty(input.subtitle),
        pix_key: nullIfEmpty(input.pixKey),
        avatar_url: nullIfEmpty(input.avatarUrl),
        logo_url: nullIfEmpty(input.logoUrl),
        background_url: nullIfEmpty(input.backgroundUrl),
        theme: normalizeClientTheme(input.theme),
        active: input.active
    };
}

export function toClientLinkPayload(clientId: string, input: ClientLinkInput): ClientLinkPayload {
    return {
        client_id: clientId,
        title: input.title.trim(),
        type: input.type,
        value: input.value.trim(),
        icon: nullIfEmpty(input.icon),
        sort_order: input.sortOrder,
        active: input.active
    };
}

export function normalizeSlug(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function nullIfEmpty(value: string | null | undefined): string | null {
    const normalized = value?.trim() ?? '';
    return normalized.length > 0 ? normalized : null;
}
