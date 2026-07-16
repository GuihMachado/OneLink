create table if not exists public.global_appearance (
    id text primary key default 'global' check (id = 'global'),
    background_mode text not null default 'solid'
        check (background_mode in ('solid', 'linear-gradient', 'radial-gradient', 'image')),
    background_color text not null default '#111827',
    gradient_start_color text not null default '#111827',
    gradient_end_color text not null default '#4f46e5',
    gradient_angle smallint not null default 135 check (gradient_angle between 0 and 360),
    background_image_url text,
    background_position_x numeric(5,2) not null default 50 check (background_position_x between 0 and 100),
    background_position_y numeric(5,2) not null default 50 check (background_position_y between 0 and 100),
    background_size text not null default 'cover' check (background_size in ('cover', 'contain', 'auto')),
    updated_at timestamptz not null default now()
);

insert into public.global_appearance (id)
values ('global')
on conflict (id) do nothing;

alter table public.global_appearance enable row level security;

create policy "Global appearance is publicly readable"
on public.global_appearance for select
to anon, authenticated
using (id = 'global');

create policy "Authenticated users can update global appearance"
on public.global_appearance for update
to authenticated
using (id = 'global')
with check (id = 'global');
