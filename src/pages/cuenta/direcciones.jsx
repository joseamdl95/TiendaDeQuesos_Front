import { useEffect, useState } from "react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from "../../api/addresses";

export default function Direcciones() {
  const emptyForm = {
    alias: "",
    direccion: "",
    cp: "",
    ciudad: "",
    provincia: "",
    facturacion: 0
  };

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    const res = await getAddresses();
    setItems(res.addresses || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e) {
    e.preventDefault();

    if (editingId) {
      await updateAddress(editingId, form);
    } else {
      await createAddress(form);
    }

    setForm(emptyForm);
    setEditingId(null);
    load();
  }

  function edit(item) {
    setEditingId(item.Id_direccion);

    setForm({
      alias: item.alias,
      direccion: item.direccion,
      cp: item.cp,
      ciudad: item.ciudad,
      provincia: item.provincia,
      facturacion: Number(item.facturacion)
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function remove(id) {
    await deleteAddress(id);
    load();
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>📍 Mis direcciones</h2>

      {/* FORMULARIO */}
      <form
        onSubmit={save}
        style={{
          display: "grid",
          gap: "10px",
          maxWidth: "450px",
          marginBottom: "30px"
        }}
      >
        <input
          placeholder="Alias"
          value={form.alias}
          onChange={(e) =>
            setForm({
              ...form,
              alias: e.target.value
            })
          }
        />

        <input
          placeholder="Dirección"
          value={form.direccion}
          onChange={(e) =>
            setForm({
              ...form,
              direccion: e.target.value
            })
          }
        />

        <input
          placeholder="Código postal"
          value={form.cp}
          onChange={(e) =>
            setForm({
              ...form,
              cp: e.target.value
            })
          }
        />

        <input
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={(e) =>
            setForm({
              ...form,
              ciudad: e.target.value
            })
          }
        />

        <input
          placeholder="Provincia"
          value={form.provincia}
          onChange={(e) =>
            setForm({
              ...form,
              provincia: e.target.value
            })
          }
        />

        <label>
          <input
            type="checkbox"
            checked={form.facturacion === 1}
            onChange={(e) =>
              setForm({
                ...form,
                facturacion: e.target.checked ? 1 : 0
              })
            }
          />
          Dirección de facturación
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">
            {editingId
              ? "💾 Guardar cambios"
              : "➕ Añadir dirección"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTADO */}
      {items.length === 0 ? (
        <p>No tienes direcciones guardadas.</p>
      ) : (
        items.map((d) => (
          <div
            key={d.Id_direccion}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px"
            }}
          >
            <strong>{d.alias}</strong>

            {Number(d.facturacion) === 1 && (
              <span> 🧾 Facturación</span>
            )}

            <p>{d.direccion}</p>
            <p>
              {d.cp} - {d.ciudad}
            </p>
            <p>{d.provincia}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => edit(d)}
              >
                ✏️ Editar
              </button>

              <button
                onClick={() =>
                  remove(d.Id_direccion)
                }
              >
                ❌ Eliminar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}