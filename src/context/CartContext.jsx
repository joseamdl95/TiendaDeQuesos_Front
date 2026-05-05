import { createContext, useContext, useEffect, useState } from "react"
import { apiFetch } from "../api/client"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔹 cargar carrito al iniciar
  useEffect(() => {
    loadCart()
  }, [])

  // PREVIEW visitante con datos reales
  async function loadGuestCart() {
    const localCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    if (localCart.length === 0) {
      setCart([]);
      return;
    }

    const res = await apiFetch("/cart/preview", {
      method: "POST",
      body: JSON.stringify({
        items: localCart
      })
    });

    setCart(res.products || []);
  }

  async function loadCart() {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        await loadGuestCart();
        return;
      }

      const res = await apiFetch("/cart");
      setCart(res.products || []);
    } catch (err) {
      console.error("Error cargando carrito", err);
    } finally {
      setLoading(false);
    }
  }

  // ➕ añadir producto
  async function addToCart(id_producto, cantidad = 1) {

    const token = localStorage.getItem("token");

    // 🔴 NO LOGUEADO → localStorage
    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      const existing = localCart.find(p => p.id_producto === id_producto);

      if (existing) {
        existing.cantidad += cantidad;
      } else {
        localCart.push({ id_producto, cantidad });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);

      await loadGuestCart();
      return;
    }

    // 🟢 LOGUEADO → backend
    await apiFetch("/cart/add", {
      method: "POST",
      body: JSON.stringify({ id_producto, cantidad })
    });

    loadCart();
  }

  // 🔄 actualizar cantidad
  async function updateCart(id_producto, cantidad) {
    const token = localStorage.getItem("token");

    // visitante
    if (!token) {
      let localCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      localCart = localCart.map(item =>
        item.id_producto === id_producto
          ? { ...item, cantidad }
          : item
      );

      localCart = localCart.filter(item => item.cantidad > 0);

      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);

      await loadGuestCart();
      return;
    }

    // logueado
    await apiFetch("/cart/update", {
      method: "PUT",
      body: JSON.stringify({ id_producto, cantidad })
    });

    loadCart();
  }

  // ❌ eliminar
  async function removeFromCart(id_producto) {
    const token = localStorage.getItem("token");

    // visitante
    if (!token) {
      const localCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ).filter(item => item.id_producto !== id_producto);

      localStorage.setItem("cart", JSON.stringify(localCart));
      setCart(localCart);

      await loadGuestCart();
      return;
    }

    // logueado
    await apiFetch("/cart/remove", {
      method: "DELETE",
      body: JSON.stringify({ id_producto })
    });

    loadCart();
  }

  //funionar carro al loguearse
  async function mergeCart(localItems) {
    if (!localItems || localItems.length === 0) return;

    await apiFetch("/cart/merge", {
      method: "POST",
      body: JSON.stringify({ items: localItems })
    });
    await loadCart();
  }

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      loadCart,
      addToCart,
      updateCart,
      removeFromCart,
      mergeCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}