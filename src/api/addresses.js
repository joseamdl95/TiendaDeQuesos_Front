import { apiFetch } from "./client";

export function getAddresses() {
  return apiFetch("/addresses");
}

export function getAddress(id) {
  return apiFetch(`/addresses/${id}`);
}

export function createAddress(data) {
  return apiFetch("/addresses", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateAddress(id, data) {
  return apiFetch(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteAddress(id) {
  return apiFetch(`/addresses/${id}`, {
    method: "DELETE"
  });
}