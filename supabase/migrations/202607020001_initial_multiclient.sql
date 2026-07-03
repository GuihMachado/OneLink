create extension if not exists pgcrypto;

create table if not exists public.clients (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    subtitle text,
    pix_key text,
    avatar_url text,
    logo_url text,
    background_url text,
    theme jsonb not null default '{}'::jsonb,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint clients_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.client_links (
    id uuid primary key default gen_random_uuid(),
    client_id uuid not null references public.clients(id) on delete cascade,
    title text not null,
    type text not null check (type in ('url', 'copy')),
    value text not null,
    icon text,
    sort_order integer not null default 0,
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists clients_active_slug_idx on public.clients (active, slug);
create index if not exists client_links_client_order_idx on public.client_links (client_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists client_links_set_updated_at on public.client_links;
create trigger client_links_set_updated_at
before update on public.client_links
for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.client_links enable row level security;

drop policy if exists "Public can read active clients" on public.clients;
create policy "Public can read active clients"
on public.clients
for select
to anon
using (active = true);

drop policy if exists "Authenticated admins can read clients" on public.clients;
create policy "Authenticated admins can read clients"
on public.clients
for select
to authenticated
using (true);

drop policy if exists "Authenticated admins can insert clients" on public.clients;
create policy "Authenticated admins can insert clients"
on public.clients
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update clients" on public.clients;
create policy "Authenticated admins can update clients"
on public.clients
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active client links" on public.client_links;
create policy "Public can read active client links"
on public.client_links
for select
to anon
using (
    active = true
    and exists (
        select 1
        from public.clients
        where clients.id = client_links.client_id
          and clients.active = true
    )
);

drop policy if exists "Authenticated admins can read client links" on public.client_links;
create policy "Authenticated admins can read client links"
on public.client_links
for select
to authenticated
using (true);

drop policy if exists "Authenticated admins can insert client links" on public.client_links;
create policy "Authenticated admins can insert client links"
on public.client_links
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated admins can update client links" on public.client_links;
create policy "Authenticated admins can update client links"
on public.client_links
for update
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('client-assets', 'client-assets', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read client assets" on storage.objects;
create policy "Public can read client assets"
on storage.objects
for select
to public
using (bucket_id = 'client-assets');

drop policy if exists "Authenticated admins can upload client assets" on storage.objects;
create policy "Authenticated admins can upload client assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'client-assets');

drop policy if exists "Authenticated admins can update client assets" on storage.objects;
create policy "Authenticated admins can update client assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'client-assets')
with check (bucket_id = 'client-assets');

insert into public.clients (
    slug,
    name,
    subtitle,
    pix_key,
    avatar_url,
    logo_url,
    background_url,
    theme,
    active
)
values (
    'renata-martho',
    'Renata Martho',
    'Consultora Mary Kay',
    '15997177434',
    '/assets/RenataMartho.jpg',
    '/assets/mary-kay.png',
    '/assets/bg-mary-kay.jpg',
    '{
        "backgroundColor": "#111827",
        "textColor": "#ffffff",
        "buttonBackgroundColor": "#ffffff",
        "buttonTextColor": "#111827",
        "buttonBorderColor": "rgba(255,255,255,0.4)"
    }'::jsonb,
    true
)
on conflict (slug) do update set
    name = excluded.name,
    subtitle = excluded.subtitle,
    pix_key = excluded.pix_key,
    avatar_url = excluded.avatar_url,
    logo_url = excluded.logo_url,
    background_url = excluded.background_url,
    theme = excluded.theme,
    active = excluded.active;

with renata as (
    select id from public.clients where slug = 'renata-martho'
)
insert into public.client_links (client_id, title, type, value, icon, sort_order, active)
select renata.id, seed.title, seed.type, seed.value, seed.icon, seed.sort_order, true
from renata
cross join (
    values
        ('Instagram', 'url', 'https://www.instagram.com/renatamartho/', 'instagram', 0),
        ('Faça parte do meu time Mary Kay', 'url', 'https://wa.me/5515997177434?text=Ol%C3%A1!+Gostaria+de+fazer+parte+do+seu+time', 'whatsapp', 1),
        ('Copiar Chave Pix', 'copy', '15997177434', 'pix', 2),
        ('Loja virtual', 'url', 'https://loja.marykay.com.br/minha-vitrine?slug=renata-martho-consultora-mary-kay', 'loja', 3),
        ('Fale Comigo', 'url', 'https://wa.me/5515997177434?text=Ol%C3%A1!', 'whatsapp', 4)
) as seed(title, type, value, icon, sort_order)
where not exists (
    select 1
    from public.client_links
    where client_links.client_id = renata.id
      and client_links.title = seed.title
);
