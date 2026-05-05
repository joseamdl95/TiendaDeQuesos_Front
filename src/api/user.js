import { apiFetch } from "./client"

export function getMe() {
  return apiFetch("/auth/me")
}

export function updateDatos(data){
  return apiFetch("/user/datos",{
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export function updateEmail(email) {
  return apiFetch("/user/email", {
    method: "PUT",
    body: JSON.stringify({ email })
  })
}

export function updatePassword(data) {
  return apiFetch("/user/password", {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export function forgotPassword(email) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  })
}

export function resetPassword(token, password) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password })
  })
}

export function enable2FA() {
  return apiFetch("/user/2fa/enable", { method: "POST" })
}

export function verify2FA(code) {
  return apiFetch("/user/2fa/verify", {
    method: "POST",
    body: JSON.stringify({ code })
  })
}

export function disable2FA() {
  return apiFetch("/user/2fa/disable", {
    method: "POST"
  })
}

