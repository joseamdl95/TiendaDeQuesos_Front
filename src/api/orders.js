import { apiFetch } from "./client";

export function getOrders() {
  return apiFetch("/orders");
}

export function getOrder(id) {
  return apiFetch(`/orders/${id}`);
}

export function getAdminOrders() {
  return apiFetch("/admin/orders");
}
export function getAdminOrder(id) {
  return apiFetch(`/admin/orders/${id}`);
}

export function updateOrderStatus(id, estado) {
  return apiFetch(`/admin/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify({ estado })
  });
}