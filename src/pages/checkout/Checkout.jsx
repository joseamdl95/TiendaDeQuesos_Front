import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getAddresses } from "../../api/addresses";
import { checkout } from "../../api/checkout";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, loadCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await loadCart();

      const res = await getAddresses();

      setAddresses(res.addresses || []);

      const fact = res.addresses?.find(
        (a) => Number(a.facturacion) === 1
      );

      if (fact) {
        setSelected(fact.Id_direccion);
      }

      setLoading(false);
    }

    init();
  }, []);

  async function confirm() {
    try {
      const res = await checkout(selected);

      alert("Pedido realizado ✅");

      navigate(`/orders/${res.pedido}`);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Cargando...</p>;

  const total = cart.reduce((acc, item) => {
    const totalSinIva = item.precio * item.cantidad;
    const ivaSubtotal = totalSinIva * item.iva / 100;
    return acc + totalSinIva + ivaSubtotal;
  }, 0);

  return (
    <div style={{ padding: "20px" }}>

      <h1>💳 Checkout</h1>

      <h2>📍 Dirección</h2>

      {addresses.map((a) => (
        <label
          key={a.Id_direccion}
          style={{
            display: "block",
            marginBottom: "10px"
          }}
        >
          <input
            type="radio"
            checked={
              selected === a.Id_direccion
            }
            onChange={() =>
              setSelected(a.Id_direccion)
            }
          />

          {a.alias} - {a.direccion},{" "}
          {a.ciudad}
        </label>
      ))}

      <hr />

      <h2>🛒 Resumen</h2>

      {cart.map((item) => (
        <p key={item.id_producto}>
          {item.nombre} x {item.cantidad}
        </p>
      ))}

      <h2>Total: {total.toFixed(2)} €</h2>

      <button onClick={confirm}>
        ✅ Confirmar pedido
      </button>
    </div>
  );
}