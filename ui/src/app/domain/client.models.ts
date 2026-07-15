export type ClientAssetKind = 'avatar' | 'background';
export type ClientLinkType = 'url' | 'copy';

export interface ClientTheme {
    backgroundColor: string;
    textColor: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    buttonBorderColor: string;
}

export interface ClientLink {
    id: string;
    title: string;
    type: ClientLinkType;
    value: string;
    icon: string;
}

export interface ClientProfile {
    id: string;
    slug: string;
    name: string;
    lastName: string;
    instagram: string | null;
    whatsapp: string | null;
    pixKey: string | null;
    facebook: string | null;
    storeUrl: string | null;
    catalogUrl: string | null;
    avatarUrl: string | null;
    backgroundUrl: string | null;
    theme: ClientTheme;
    active: boolean;
    links: ClientLink[];
}

export interface ClientInput extends Omit<ClientProfile, 'id' | 'links'> {}

export interface ClientRecord {
    id: string;
    slug: string;
    name: string;
    last_name: string | null;
    instagram: string | null;
    whatsapp: string | null;
    pix_key: string | null;
    facebook: string | null;
    store_url: string | null;
    catalog_url: string | null;
    avatar_url: string | null;
    background_url: string | null;
    theme: Partial<ClientTheme> | null;
    active: boolean;
}

export interface ClientPayload {
    slug: string;
    name: string;
    last_name: string;
    instagram: string | null;
    whatsapp: string | null;
    pix_key: string | null;
    facebook: string | null;
    store_url: string | null;
    catalog_url: string | null;
    avatar_url: string;
    background_url: string | null;
    theme: ClientTheme;
    active: boolean;
}

export const DEFAULT_CLIENT_THEME: ClientTheme = {
    backgroundColor: '#111827', textColor: '#ffffff', buttonBackgroundColor: '#ffffff',
    buttonTextColor: '#111827', buttonBorderColor: 'rgba(255,255,255,0.4)'
};

export function normalizeClientTheme(theme: Partial<ClientTheme> | null | undefined): ClientTheme {
    return { ...DEFAULT_CLIENT_THEME, ...(theme ?? {}) };
}

export function mapClientRecord(record: ClientRecord): ClientProfile {
    const client: ClientProfile = {
        id: record.id, slug: record.slug, name: record.name, lastName: record.last_name ?? '',
        instagram: record.instagram, whatsapp: record.whatsapp, pixKey: record.pix_key,
        facebook: record.facebook, storeUrl: record.store_url, catalogUrl: record.catalog_url,
        avatarUrl: record.avatar_url, backgroundUrl: record.background_url,
        theme: normalizeClientTheme(record.theme), active: record.active, links: []
    };
    client.links = buildClientLinks(client);
    return client;
}

export function buildClientLinks(client: ClientProfile): ClientLink[] {
    const links: Array<ClientLink | null> = [
        client.instagram ? fixedLink('instagram', 'Instagram', 'url', normalizeSocialUrl(client.instagram, 'instagram.com'), 'instagram') : null,
        client.whatsapp ? fixedLink('whatsapp', 'WhatsApp', 'url', whatsappUrl(client.whatsapp), 'whatsapp') : null,
        client.pixKey ? fixedLink('pix', 'Copiar chave Pix', 'copy', client.pixKey, 'pix') : null,
        client.facebook ? fixedLink('facebook', 'Facebook', 'url', normalizeSocialUrl(client.facebook, 'facebook.com'), 'facebook') : null,
        client.storeUrl ? fixedLink('store', 'Loja virtual', 'url', normalizeUrl(client.storeUrl), 'loja') : null,
        client.catalogUrl ? fixedLink('catalog', 'Catálogo', 'url', normalizeUrl(client.catalogUrl), 'catalogo') : null
    ];
    return links.filter((link): link is ClientLink => link !== null);
}

function fixedLink(id: string, title: string, type: ClientLinkType, value: string, icon: string): ClientLink {
    return { id, title, type, value, icon };
}

export function toClientPayload(input: ClientInput): ClientPayload {
    return {
        slug: normalizeSlug(input.slug), name: input.name.trim(), last_name: input.lastName.trim(),
        instagram: nullIfEmpty(input.instagram), whatsapp: nullIfEmpty(input.whatsapp)?.replace(/\D/g, '') ?? null,
        pix_key: nullIfEmpty(input.pixKey), facebook: nullIfEmpty(input.facebook),
        store_url: nullIfEmpty(input.storeUrl), catalog_url: nullIfEmpty(input.catalogUrl),
        avatar_url: input.avatarUrl?.trim() ?? '', background_url: nullIfEmpty(input.backgroundUrl),
        theme: normalizeClientTheme(input.theme), active: input.active
    };
}

export function normalizeUrl(value: string): string {
    const trimmed = value.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function normalizeSocialUrl(value: string, domain: string): string {
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${domain}/${trimmed.replace(/^@/, '').replace(/^\/+|\/+$/g, '')}`;
}

export function whatsappUrl(value: string): string {
    let digits = value.replace(/\D/g, '');
    if (!digits.startsWith('55')) digits = `55${digits}`;
    return `https://wa.me/${digits}`;
}

export function normalizeSlug(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function nullIfEmpty(value: string | null | undefined): string | null {
    const normalized = value?.trim() ?? '';
    return normalized ? normalized : null;
}
