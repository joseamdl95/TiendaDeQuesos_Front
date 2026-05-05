import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../api/orders";

export default function MisPedidos() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((res) => {
        setOrders(res.orders || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Error cargando pedidos");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  return (
  <div style={{ padding: "20px" }}>
    
    <h1>📦 Mis pedidos</h1>

    {orders.length === 0 ? (
      <p>No tienes pedidos todavía.</p>
    ) : (
      <table style={{ 
        width: "100%", 
        borderCollapse: "collapse"
      }}>
        <thead>
          <tr style={{ 
            borderBottom: "1px solid #ddd"
          }}>
            <th style={{ padding: "12px" }}>ID Pedido</th>
            <th style={{ padding: "12px" }}>Fecha</th>
            <th style={{ padding: "12px" }}>Total</th>
            <th style={{ padding: "12px" }}>Estado</th>
            <th style={{ padding: "12px" }}>Acciones</th>
           </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr 
              key={order.id_pedido}
              style={{ 
                borderBottom: "1px solid #eee"
              }}
            >
              <td style={{ padding: "12px" }}>{order.id_pedido}</td>
              <td style={{ padding: "12px" }}>{order.fecha_pedido}</td>
              <td style={{ padding: "12px" }}>
                {(Number(order.total) + Number(order.total_iva)).toFixed(2)} €
              </td>
              <td style={{ padding: "12px" }}>{order.estado}</td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => navigate(`/orders/${order.id_pedido}`)}
                  style={{
                    background: "none",
                    border: "1px solid #ccc",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}