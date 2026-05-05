import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminOrders,
  updateOrderStatus
} from "../../api/orders";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  async function loadOrders() {
    const res = await getAdminOrders();
    setOrders(res.orders || []);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function changeStatus(id, estado) {
    await updateOrderStatus(id, estado);
    loadOrders();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Gestión Pedidos</h1>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Detalle</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id_pedido}>
              <td>{o.id_pedido}</td>

              <td>
                {o.nombre} {o.apellidos}
              </td>

              <td>{o.email}</td>

              <td>{o.fecha_pedido}</td>

              <td>
                {(
                  Number(o.total) +
                  Number(o.total_iva)
                ).toFixed(2)} €
              </td>

              <td>
                <select
                  value={o.estado}
                  onChange={(e) =>
                    changeStatus(
                      o.id_pedido,
                      e.target.value
                    )
                  }
                >
                  <option value="PENDIENTE">
                    PENDIENTE
                  </option>

                  <option value="EN PREPARACION">
                    EN PREPARACION
                  </option>

                  <option value="ENVIADO">
                    ENVIADO
                  </option>

                  <option value="ENTREGADO">
                    ENTREGADO
                  </option>

                  <option value="CANCELADO">
                    CANCELADO
                  </option>
                </select>
              </td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => navigate(`/admin/orders/${o.id_pedido}`)}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}