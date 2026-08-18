-- Chromaforge initial schema
-- pigments/brand_paints/brand_paint_pigments are a public reference library, seeded via migration,
-- not user-editable. user_collection/matches are per-user data protected by RLS.

create extension if not exists "pgcrypto";

create table pigments (
  id uuid primary key default gen_random_uuid(),
  ci_code text not null unique,
  common_name text not null,
  category text,
  masstone_hex text not null,
  opacity text not null check (opacity in ('opaque', 'semi-opaque', 'semi-transparent', 'transparent')),
  tinting_strength text not null check (tinting_strength in ('low', 'medium', 'high', 'very high')),
  is_approx boolean not null default false,
  source_notes text,
  created_at timestamptz not null default now()
);

create table brand_paints (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  product_name text not null,
  reference_hex text,
  created_at timestamptz not null default now(),
  unique (brand, product_name)
);

create table brand_paint_pigments (
  brand_paint_id uuid not null references brand_paints(id) on delete cascade,
  pigment_id uuid not null references pigments(id) on delete restrict,
  primary key (brand_paint_id, pigment_id)
);

create table user_collection (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand_paint_id uuid not null references brand_paints(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, brand_paint_id)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_hex text not null,
  target_lab jsonb,
  source_image_url text,
  source_image_coords jsonb,
  recipe jsonb not null,
  delta_e numeric,
  created_at timestamptz not null default now()
);

create index brand_paint_pigments_pigment_id_idx on brand_paint_pigments(pigment_id);
create index user_collection_user_id_idx on user_collection(user_id);
create index matches_user_id_idx on matches(user_id);

-- RLS

alter table pigments enable row level security;
alter table brand_paints enable row level security;
alter table brand_paint_pigments enable row level security;
alter table user_collection enable row level security;
alter table matches enable row level security;

create policy "pigments are publicly readable"
  on pigments for select
  using (true);

create policy "brand_paints are publicly readable"
  on brand_paints for select
  using (true);

create policy "brand_paint_pigments are publicly readable"
  on brand_paint_pigments for select
  using (true);

create policy "users manage their own collection"
  on user_collection for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage their own matches"
  on matches for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
