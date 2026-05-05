import { apiFetch } from "./client";

export function getProducts() {
  return apiFetch("/products");
}

export function getAdminProducts() {
  return apiFetch("/admin/products");
}

export function createProduct(data) {
  return apiFetch("/admin/products", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProduct(id, data) {
  return apiFetch(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}