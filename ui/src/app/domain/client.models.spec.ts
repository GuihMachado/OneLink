import { DEFAULT_CLIENT_THEME, buildClientLinks, mapClientRecord, normalizeSlug, normalizeSocialUrl, normalizeUrl, toClientPayload, whatsappUrl } from './client.models';

describe('client models', () => {
    const record = {
        id: '1', slug: 'renata-martho', name: 'Renata', last_name: 'Martho', instagram: '@renata',
        whatsapp: '15997177434', pix_key: 'pix-123', facebook: null, store_url: 'loja.com', catalog_url: null,
        avatar_url: 'https://img.test/avatar.jpg', background_url: null, theme: null, active: true
    };

    it('normalizes slugs with first and last name', () => {
        expect(normalizeSlug(' João da Silva ')).toBe('joao-da-silva');
    });

    it('creates only buttons whose fields have values in the fixed order', () => {
        const client = mapClientRecord(record);
        expect(buildClientLinks(client).map((link) => link.id)).toEqual(['instagram', 'whatsapp', 'pix', 'store']);
    });

    it('normalizes social, regular and WhatsApp links', () => {
        expect(normalizeSocialUrl('@renata', 'instagram.com')).toBe('https://instagram.com/renata');
        expect(normalizeUrl('loja.com')).toBe('https://loja.com');
        expect(whatsappUrl('(15) 99717-7434')).toBe('https://wa.me/5515997177434');
    });

    it('creates the fixed client payload and strips phone formatting', () => {
        const client = mapClientRecord(record);
        const payload = toClientPayload({ ...client, links: undefined } as never);
        expect(payload.last_name).toBe('Martho');
        expect(payload.whatsapp).toBe('15997177434');
        expect(payload.avatar_url).toBe(record.avatar_url);
        expect(client.theme).toEqual(DEFAULT_CLIENT_THEME);
    });
});
