-- ============================================================
-- PadrronCroche — Schema (Etapa 2: pedidos e pagamento)
-- ============================================================
-- Como rodar:
-- 1. Abra seu projeto em https://supabase.com/dashboard
-- 2. Vá em "SQL Editor" no menu lateral
-- 3. Cole todo este arquivo e clique em "Run"
--    (rode depois do supabase/schema.sql, que cria a tabela de perfis)
--
-- O que isso cria:
-- - Tabela "orders": um registro por pedido (status, total, referência
--   do pagamento no Mercado Pago)
-- - Tabela "order_items": quais produtos entraram em cada pedido
-- - Row Level Security: cada cliente só enxerga os PRÓPRIOS pedidos.
--   Ninguém consegue criar ou alterar pedidos direto pelo navegador —
--   isso só acontece pelo nosso servidor (checkout e webhook de
--   pagamento), usando a chave "service_role", que ignora essas regras
--   de propósito (por isso ela nunca pode vazar para o navegador).
-- ============================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  total numeric(10, 2) not null,
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text not null,
  product_title text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null default 1
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Usuários veem os próprios pedidos"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Usuários veem os itens dos próprios pedidos"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Nenhuma policy de INSERT/UPDATE/DELETE é criada de propósito: pedidos só
-- podem ser criados/alterados pelo servidor (service_role), nunca
-- diretamente pelo navegador do cliente.
