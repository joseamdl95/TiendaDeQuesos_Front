import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getOrder, getAdminOrder } from "../../api/orders";

export default function DetallePedido() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const request =
      user.rol === "ADMIN"
        ? getAdminOrder(id)
        : getOrder(id);

    request
      .then((res) => {
        setOrder(res.order);
        setItems(res.items || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Pedido no encontrado");

        if (user.rol === "ADMIN") {
          navigate("/admin/orders");
        } else {
          navigate("/orders");
        }
      })
      .finally(() => setLoading(false));

  }, [id, user]);

  if (loading) {
    return <p>Cargando pedido...</p>;
  }

  if (!order) {
    return <p>No existe pedido.</p>;
  }

  const precioConIva = (producto) => {
    const precio = Number(producto.precio);
    const iva = Number(producto.iva);
    return (precio + (precio * iva / 100)).toFixed(2);
  };

  const subtotal = (item) => {
    return (item.cantidad * (precioConIva(item))).toFixed(2);
  }

  const total =
    Number(order.total) +
    Number(order.total_iva);

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() =>
          navigate(
            user?.rol === "ADMIN"
              ? "/admin/orders"
              : "/orders"
          )
        }
      >
        ⬅️ Volver
      </button>

      <h1>📦 Detalle pedido</h1>

      <p>
        <strong>ID:</strong>{" "}
        {order.id_pedido}
      </p>

      <p>
        <strong>Fecha:</strong>{" "}
        {order.fecha_pedido}
      </p>

      <p>
        <strong> Direccion de envio:</strong>{" "}
        {order.direccion + " "+ order.cp + " "+ order.ciudad + " "+ order.provincia}
        
      </p>

      <hr />

      <h2>Productos</h2>

      {items.map((item, index) => (
        <div
          key={index}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "10px 0"
          }}
        >
          <p>
            <strong>{item.nombre}</strong>
          </p>

          <p>
            {item.cantidad} x {precioConIva(item)} €
          </p>

          <p>
            Subtotal:{" "}
            {subtotal(item)} €
          </p>
        </div>
      ))}

      <hr />

      <p>
        Base imponible:{" "}
        {Number(order.total).toFixed(2)} €
      </p>

      <p>
        IVA:{" "}
        {Number(order.total_iva).toFixed(2)} €
      </p>

      <h2>Total: {total.toFixed(2)} €</h2>
    </div>
  );
}