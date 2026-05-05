import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Perfil from "../pages/cuenta/Perfil";
import Productos from "../pages/productos/Productos";
import Carrito from "../pages/Cart/Carrito";
import MisPedidos from "../pages/Orders/MisPedidos";
import DetallePedido from "../pages/Orders/DetallePedido";
import Checkout from "../pages/checkout/Checkout";

import PrivateRoute from "./PrivateRoute";

import AdminRoute from "./AdminRoute";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";

export default function AppRouter() {
  return (
    <Routes>

      {/* Públicas */}
      <Route path="/" element={<Productos />} />
      <Route path="/cart" element={<Carrito />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />      

      {/* Protegidas */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <MisPedidos />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <DetallePedido />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

      {/* Administrador*/}
       <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <AdminRoute>
              <DetallePedido />
            </AdminRoute>
          }
        />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}