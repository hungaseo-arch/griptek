-- documents: stores every saved business document (PO / PI / CI / PL / QT).
-- Each row keeps the doc type, its human-readable number, and the full form
-- content as a JSONB payload so the 5 differently-shaped documents share one table.

create extension if not exists "pgcrypto";

create table if not exists public.documents (
  id          uuid primary key default gen_random_uuid(),
  doc_type    text not null check (doc_type in ('PO', 'PI', 'CI', 'PL', 'QT')),
  doc_no      text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists documents_doc_type_idx  on public.documents (doc_type);
create index if not exists documents_created_at_idx on public.documents (created_at desc);

alter table public.documents enable row level security;

-- NOTE: the SPA talks to Supabase with the public anon key and has no user auth,
-- so these policies let the anon role insert and read documents. This is
-- appropriate for an internal tool; add auth + tighter policies if the app
-- is ever exposed to untrusted users.
create policy "anon insert documents"
  on public.documents for insert to anon with check (true);

create policy "anon select documents"
  on public.documents for select to anon using (true);
