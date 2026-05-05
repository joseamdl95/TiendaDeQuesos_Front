import{ apiFetch } from "./client";

export function checkout(id_direccion){
    return apiFetch("/checkout",{
        method: "POST",
        body: JSON.stringify({
            id_direccion
        })
    });
}