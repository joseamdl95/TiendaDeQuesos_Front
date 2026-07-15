# Tienda de Quesos - Frontend

Interfaz de usuario para la tienda online de quesos, desarrollada con React y Vite. Permite navegar por el catálogo, gestionar carrito, realizar pedidos y administrar la tienda (roles de usuario y admin).

## 🛠️ Stack
- React 18
- Vite
- React Router
- Context API (AuthContext, CartContext)
- Desplegado en Vercel

## ⚙️ Instalación local

1. Clona el repositorio:

   git clone https://github.com/joseamdl95/TiendaDeQuesos_Front.git

2. Instala las dependencias:

   npm install

3. Crea un archivo .env en la raíz con la URL del backend:

   VITE_API_URL=http://localhost:8000
   (Si usas el backend desplegado, cámbialo por su URL real)

4. Arranca el servidor de desarrollo:

   npm run dev
   La aplicación estará disponible en http://localhost:5173

## Funcionalidades principales
   -Registro e inicio de sesión con 2FA (Google Authenticator)
   -Catálogo de productos con stock e imágenes
   -Carrito de compra híbrido (persistente en localStorage y sincronizado con BD)
   -Panel de usuario: edición de perfil, direcciones, historial de pedidos
   -Panel de administrador: gestión de productos, stock y pedidos

## Despliege
   La aplicacion esta desplegada, pruebela en: https://tienda-de-quesos-front.vercel.app
