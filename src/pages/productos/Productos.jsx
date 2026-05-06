import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getProducts } from "../../api/products";

export default function Productos() {
    const navigate = useNavigate();

    const { user, logout } = useAuth();
    const {addToCart} = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const precioConIva = (producto) => {
        const precio = Number(producto.precio);
        const iva = Number(producto.iva);
        return (precio + (precio * iva / 100)).toFixed(2);
    };

    useEffect(() => {
        getProducts()
        .then((data) => {
            setProducts(data.products);
        })
        .catch((err) => {
            console.error(err);
            alert("Error cargando productos");
        })
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div style={{ padding: "20px" }}>

            <h1>Tienda de Quesos </h1>

            {/* PRODUCTOS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.map((p) => (
                    <div key={p.id_producto} style={{ border: "1px solid #ddd", padding: "10px" }}>
                        
                        <img 
                            src={p.url_imagen} 
                            alt={p.nombre} 
                            style={{ 
                                width: "100%",
                                height: "300px",   
                                objectFit: "cover",
                                display: "block"
                            }}
                        />

                        <h3>{p.nombre}</h3>
                        <p>{p.descripcion}</p>
                         <strong> {precioConIva(p)} € </strong>

                        {/* 🛒 BOTÓN NUEVO */}
                        <button 
                            style={{ marginTop: "10px" }}
                            onClick={async () => {
                                await addToCart(p.id_producto)
                                alert("Producto añadido 🧀")
                            }}
                        >
                            🛒 Añadir al carrito
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
}