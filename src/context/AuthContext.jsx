import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/auth";
import { useCart } from "./CartContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { mergeCart, loadCart } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error();

        setUser(data.user);
        await loadCart();

      } catch {
        localStorage.removeItem("token");
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // LOGIN NORMAL
  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await apiLogin(email, password);

      if (data?.requires_2fa) {
        return data;
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);

        // fusionar carrito visitante
        const localCart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        if (localCart.length > 0) {
          await mergeCart(localCart);
          localStorage.removeItem("cart");
        }


        await loadCart();

        return data;
      }

      return data;

    } finally {
      setLoading(false);
    }
  };

  // LOGIN 2FA
  const verify2FALogin = async (email, code) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-2fa`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Código inválido");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);

      // fusionar carrito visitante
      const localCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      if (localCart.length > 0) {
        await mergeCart(localCart);
        localStorage.removeItem("cart");
      }

      await loadCart();

      return data;

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        verify2FALogin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}