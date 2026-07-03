import {
    DEFAULT_CLIENT_THEME,
    mapClientRecord,
    mapLinkRecord,
    normalizeSlug,
    toClientPayload
} from './client.models';

describe('client models', () => {
    it('normalizes client slugs', () => {
        expect(normalizeSlug(' Renata Martho Consultora ')).toBe('renata-martho-consultora');
        expect(normalizeSlug('João & Maria')).toBe('joao-maria');
    });

    it('maps client records with default theme values', () => {
        const client = mapClientRecord({
            id: 'client-id',
            slug: 'renata-martho',
            name: 'Renata Martho',
            subtitle: null,
            pix_key: null,
            avatar_url: null,
            logo_url: null,
            background_url: null,
            theme: {
                textColor: '#eeeeee'
            },
            active: true
        });

        expect(client.theme.textColor).toBe('#eeeeee');
        expect(client.theme.buttonBackgroundColor).toBe(DEFAULT_CLIENT_THEME.buttonBackgroundColor);
    });

    it('maps link records', () => {
        const link = mapLinkRecord({
            id: 'link-id',
            client_id: 'client-id',
            title: 'Instagram',
            type: 'url',
            value: 'https://example.com',
            icon: null,
            sort_order: 2,
            active: true
        });

        expect(link.clientId).toBe('client-id');
        expect(link.icon).toBe('');
        expect(link.sortOrder).toBe(2);
    });

    it('creates client payloads using database field names', () => {
        const payload = toClientPayload({
            slug: ' Cliente Teste ',
            name: ' Cliente Teste ',
            subtitle: '',
            pixKey: ' 123 ',
            avatarUrl: '',
            logoUrl: null,
            backgroundUrl: null,
            theme: DEFAULT_CLIENT_THEME,
            active: true
        });

        expect(payload.slug).toBe('cliente-teste');
        expect(payload.name).toBe('Cliente Teste');
        expect(payload.subtitle).toBeNull();
        expect(payload.pix_key).toBe('123');
        expect(payload.avatar_url).toBeNull();
    });
});
