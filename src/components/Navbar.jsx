import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  const { cart = [] } = useCart();

  const totalItems = (cart || []).reduce((acc, item) => {
    return acc + Number(item.cantidad || 0);
  }, 0);

  return (
    <>
      {/* CABECERA CON LOGO */}
      <header
        style={{
          width: "100%",
          backgroundColor: "#f8f5ef",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px 0",
          borderBottom: "1px solid #ddd"
        }}
      >
        <Link to="/">
          <img
            src="https://pub-b6e9caf0a05440a78986b5a53989c2d5.r2.dev/logo-quesos.png"
            alt="Tienda de Quesos"
            style={{
              width: "100%",
              maxWidth: "900px",
              height: "auto",
              objectFit: "contain"
            }}
          />
        </Link>
      </header>

      {/* NAVBAR */}
      <nav
        style={{
          padding: "15px 20px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        {/* VISITANTE / USER */}
        {!user || user.rol === "USER" ? (
          <>
            <Link to="/">🏠 Tienda</Link>
            <Link to="/cart">
              🛒 Carrito ({totalItems})
            </Link>
          </>
        ) : null}

        {/* USER LOGUEADO */}
        {user && user.rol === "USER" && (
          <>
            <Link to="/orders">
              📦 Mis pedidos
            </Link>

            <Link to="/perfil">
              👤 Perfil
            </Link>

            <button onClick={logout}>
              🚪 Logout
            </button>
          </>
        )}

        {/* VISITANTE */}
        {!user && (
          <>
            <Link to="/login">
              🔐 Login
            </Link>

            <Link to="/register">
              📝 Registro
            </Link>
          </>
        )}

        {/* ADMIN */}
        {user && user.rol === "ADMIN" && (
          <>
            <Link to="/admin/products">
              📦 Productos
            </Link>

            <Link to="/admin/orders">
              📦 Pedidos
            </Link>

            <Link to="/">
              🏠 Ver tienda
            </Link>

            <Link to="/perfil">
              👤 Perfil
            </Link>

            <button onClick={logout}>
              🚪 Logout
            </button>
          </>
        )}
      </nav>
    </>
    
  );
}