-- ============================================================
-- PadrronCroche — Schema inicial (Etapa 1: cadastro e login)
-- ============================================================
-- Como rodar:
-- 1. Abra seu projeto em https://supabase.com/dashboard
-- 2. Vá em "SQL Editor" no menu lateral
-- 3. Cole todo este arquivo e clique em "Run"
--
-- O que isso cria:
-- - Tabela "profiles": guarda o nome do cliente (o e-mail e a senha
--   já ficam guardados automaticamente pelo Supabase Auth, de forma
--   segura, na tabela interna auth.users — não precisamos duplicar isso)
-- - Um gatilho (trigger) que cria automaticamente uma linha em "profiles"
--   toda vez que alguém se cadastra
-- - Row Level Security (RLS): cada cliente só pode ver/editar o
--   PRÓPRIO perfil, nunca o de outra pessoa
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuários podem ver o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuários podem atualizar o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Cria o perfil automaticamente assim que alguém se cadastra,
-- puxando o nome que a pessoa digitou no formulário de cadastro.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
