import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  getMe,
  updateDatos,
  updateEmail,
  updatePassword,
  enable2FA,
  verify2FA,
  disable2FA,
} from "../../api/user";
import { useAuth } from "../../context/AuthContext";
import Direcciones from "./direcciones";

export default function Usuario() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [twoFA, setTwoFA] = useState(false);
  const [twoFAPending, setTwoFAPending] = useState(false);
  const [code, setCode] = useState("");
  const [qr, setQr] = useState("");

  useEffect(() => {
    getMe()
      .then((data) => {
        const u = data.user;
        setUser(u);
        setNombre(u.nombre || "");
        setApellidos(u.apellidos || "");
        setTelefono(u.telefono || "");
        setEmail(u.email || "");
        setTwoFA(!!u["2fa_activo"]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // DATOS
  const handleDatos = async (e) => {
    e.preventDefault();
    try {
      await updateDatos({ nombre, apellidos, telefono });
      alert("Datos actualizados");
    } catch (err) {
      alert(err.message);
    }
  };

  // EMAIL
  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      await updateEmail(email);
      alert("Email actualizado");
    } catch (err) {
      alert(err.message);
    }
  };

  // PASSWORD
  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      alert("Contraseña actualizada");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.message);
    }
  };

  // 2FA
  const handleEnable2FA = async () => {
    const res = await enable2FA();
    setQr(res.qr);
    setTwoFAPending(true);
  };

  const handleVerify2FA = async () => {
    try {
      await verify2FA(code);
      setTwoFA(true);
      setTwoFAPending(false);
      setCode("");
      setQr("");
      alert("2FA activado");
    } catch {
      alert("Código incorrecto");
    }
  };

  const handleDisable2FA = async () => {
    await disable2FA();
    setTwoFA(false);
    alert("2FA desactivado");
  };

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>Error</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>

      <h1>👤 Mi perfil</h1>

      {/* DATOS */}
      <form onSubmit={handleDatos}>
        <h3>Datos personales</h3>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
        <input value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="Apellidos" />
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
        <button type="submit">Guardar</button>
      </form>

      {/*Direcciones*/}
      <hr style={{ margin: "30px 0" }} />

      <Direcciones />

      <hr style={{ margin: "30px 0" }} />

      {/* EMAIL */}
      <form onSubmit={handleEmail}>
        <h3>Email</h3>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Actualizar email</button>
      </form>

      {/* PASSWORD */}
      <form onSubmit={handlePassword}>
        <h3>Contraseña</h3>
        <input
          type="password"
          placeholder="Actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nueva"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Cambiar contraseña</button>
      </form>

      {/* 2FA */}
      <div>
        <h3>2FA</h3>

        {!twoFA && !twoFAPending && (
          <button onClick={handleEnable2FA}>Activar 2FA</button>
        )}

        {twoFAPending && (
          <div>
            <img src={qr} alt="QR" />
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código" />
            <button onClick={handleVerify2FA}>Verificar</button>
          </div>
        )}

        {twoFA && (
          <button onClick={handleDisable2FA}>Desactivar 2FA</button>
        )}
      </div>
    </div>
  );
}