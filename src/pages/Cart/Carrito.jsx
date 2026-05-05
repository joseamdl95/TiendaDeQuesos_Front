import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Carrito() {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    loadCart,
    updateCart,
    removeFromCart
  } = useCart();

  const [processing, setProcessing] = useState(false);

  const precioConIva = (producto) => {
    const precio = Number(producto.precio);
    const iva = Number(producto.iva);
    return (precio + (precio * iva / 100)).toFixed(2);
  };

  const subtotal = (item) => {
    return (item.cantidad * (precioConIva(item))).toFixed(2);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleCheckout() {
    const token = localStorage. getItem("token");

    if(!token){
      navigate("/login");
      return;
    }

    try{
      setProcessing(true);

      await loadCart;

      navigate("/checkout");

    } catch(err){
      alert(err.message || "Error al finalizar la compra")
    }finally{
      setProcessing(false);
    }
  }

  if (loading) {
    return <p>Cargando carrito...</p>;
  }

  const total = cart.reduce((acc, item) => {
    return acc + precioConIva(item) * item.cantidad;
  }, 0);

  return (
    <div style={{ padding: "20px" }}>

      <h1>🛒 Mi carrito</h1>

      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id_producto}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <h3>{item.nombre}</h3>

                <p>{precioConIva(item)} € unidad</p>

                <p>Stock: {item.stock}</p>

                <p>
                  Subtotal:{" "}
                  <strong>
                    {subtotal(item)} €
                  </strong>
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center"
                }}
              >
                <input
                  type="number"
                  min="0"
                  max={item.stock}
                  value={item.cantidad}
                  onChange={(e) =>
                    updateCart(
                      item.id_producto,
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: "60px",
                    textAlign: "center"
                  }}
                />

                <button
                  onClick={() =>
                    removeFromCart(
                      item.id_producto
                    )
                  }
                >
                  ❌
                </button>
              </div>
            </div>
          ))}

          <h2>Total: {total.toFixed(2)} €</h2>

          <button
            onClick={handleCheckout}
            disabled={processing}
          >
            {processing ? "Procesando..." : "💳 Tramitar Pedido"}
          </button>
        </>
      )}
    </div>
  );
}