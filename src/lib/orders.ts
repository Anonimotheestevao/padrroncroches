import { createServerFn } from "@tanstack/react-start";
import { products } from "@/data/products";
import { supabaseAdmin } from "./server/supabaseAdmin";

async function getUserFromToken(accessToken: string) {
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) {
    throw new Error("Sessão inválida. Faça login novamente.");
  }
  return data.user;
}

function resolveDeliveryUrl(slug: string): string | null {
  const product = products.find((p) => p.slug === slug);
  return product?.deliveryUrl ?? null;
}

export const getOrder = createServerFn({ method: "POST" })
  .validator((input: { accessToken: string; orderId: string }) => input)
  .handler(async ({ data }) => {
    const user = await getUserFromToken(data.accessToken);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, status, total, created_at")
      .eq("id", data.orderId)
      .single();

    if (orderError || !order || order.user_id !== user.id) {
      throw new Error("Pedido não encontrado.");
    }

    const { data: orderItems } = await supabaseAdmin
      .from("order_items")
      .select("product_slug, product_title, unit_price, quantity")
      .eq("order_id", order.id as string);

    return {
      status: order.status as string,
      total: order.total as number,
      createdAt: order.created_at as string,
      items: (orderItems ?? []).map((item) => ({
        productSlug: item.product_slug as string,
        productTitle: item.product_title as string,
        deliveryUrl: order.status === "paid" ? resolveDeliveryUrl(item.product_slug as string) : null,
      })),
    };
  });

export const listOrders = createServerFn({ method: "POST" })
  .validator((input: { accessToken: string }) => input)
  .handler(async ({ data }) => {
    const user = await getUserFromToken(data.accessToken);

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, status, total, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !orders) {
      throw new Error("Não foi possível carregar seus pedidos.");
    }

    const orderIds = orders.map((o) => o.id as string);
    const { data: allItems } = await supabaseAdmin
      .from("order_items")
      .select("order_id, product_slug, product_title")
      .in("order_id", orderIds.length ? orderIds : ["00000000-0000-0000-0000-000000000000"]);

    return orders.map((order) => ({
      id: order.id as string,
      status: order.status as string,
      total: order.total as number,
      createdAt: order.created_at as string,
      items: (allItems ?? [])
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          productSlug: item.product_slug as string,
          productTitle: item.product_title as string,
          deliveryUrl: order.status === "paid" ? resolveDeliveryUrl(item.product_slug as string) : null,
        })),
    }));
  });
