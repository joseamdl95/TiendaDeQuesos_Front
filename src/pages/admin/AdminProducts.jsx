import { useEffect, useState } from "react";
import {
  getAdminProducts,
  createProduct,
  updateProduct
} from "../../api/products";

export default function AdminProducts() {
  const emptyForm = {
    id_producto: "",
    nombre: "",
    descripcion: "",
    precio: "",
    iva: "10",
    stock: "",
    url_imagen: "",
    activo: 1
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    const res = await getAdminProducts();
    setProducts(res.products || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function editProduct(product) {
    setForm({
      id_producto: product.id_producto,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      iva: product.iva,
      stock: product.stock,
      url_imagen: product.url_imagen,
      activo: Number(product.activo)
    });

    setEditing(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: Number(form.precio),
        iva: Number(form.iva),
        stock: Number(form.stock),
        url_imagen: form.url_imagen,
        activo: Number(form.activo)
      };

      if (editing) {
        await updateProduct(form.id_producto, payload);
        alert("Producto actualizado ✅");
      } else {
        await createProduct(payload);
        alert("Producto creado ✅");
      }

      resetForm();
      await loadProducts();

    } catch (err) {
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActivo(product) {
    try {
      await updateProduct(product.id_producto, {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: Number(product.precio),
        iva: Number(product.iva),
        stock: Number(product.stock),
        url_imagen: product.url_imagen,
        activo: Number(product.activo) === 1 ? 0 : 1
      });

      await loadProducts();

    } catch (err) {
      alert(err.message);
    }
  }

  const precioConIva = (producto) => {
        const precio = Number(producto.precio);
        const iva = Number(producto.iva);
        return (precio + (precio * iva / 100)).toFixed(2);
    };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Panel Admin Productos</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "30px"
        }}
      >
        <h2>
          {editing ? "✏️ Editar producto" : "➕ Nuevo producto"}
        </h2>

        <label>Nombre </label>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>Descripcion </label>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
          rows="3"
          style={{ width: "300px" }}
        />

        <br /><br />

        <label>Precio </label>
        <input
          name="precio"
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>iva </label>
        <select
          name="iva"
          value={form.iva}
          onChange={handleChange}
        >
          <option value="0">0%</option>
          <option value="4">4%</option>
          <option value="10">10%</option>
          <option value="21">21%</option>
        </select>

        <br /><br />

        <p> Precio Con iva: {precioConIva(form)} €</p>

        <br /><br />

        <label>Stock </label>
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <br /><br />

        <label>Imagen </label>
        <input
          name="url_imagen"
          placeholder="URL imagen"
          value={form.url_imagen}
          onChange={handleChange}
        />

        <br /><br />
        
        {editing && (
          <>
            <label>Activo </label>
            <select
              name="activo"
              value={form.activo}
              onChange={handleChange}
            >
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>

            <br /><br />
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : editing
            ? "Actualizar"
            : "Crear"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>IVA</th>
            <th>Precio con iva </th>
            <th>Stock</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id_producto}>
                <td>{p.nombre}</td>
                <td>{p.precio} €</td>
                <td>{p.iva}%</td>
                <td>{precioConIva(p)} €</td>
                <td>
                    <input
                        type="number"
                        defaultValue={p.stock}
                        style={{ width: "70px" }}
                        onBlur={async (e) => {
                        await updateProduct(p.id_producto, {
                            ...p,
                            stock: Number(e.target.value)
                        });

                        loadProducts();
                        }}
                    />
                </td>
                <td>
                {Number(p.activo) === 1 ? "Sí" : "No"}
                </td>
                <td>
                    <button
                    onClick={() => editProduct(p)}
                    >
                    ✏️ Editar
                    </button>

                    <button
                    onClick={() => toggleActivo(p)}
                    style={{ marginLeft: "10px" }}
                    >
                    {Number(p.activo) === 1
                        ? "Desactivar"
                        : "Activar"}
                    </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}