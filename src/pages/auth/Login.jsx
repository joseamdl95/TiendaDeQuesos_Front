import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code2fa, setCode2fa] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [error, setError] = useState(null);

  const { user, login, verify2FALogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // LOGIN NORMAL
      if (!show2FA) {
        const data = await login(email, password);

        if (data?.requires_2fa) {
          setShow2FA(true);
          return;
        }

        if (data?.token) {
          if (data.user.rol === "ADMIN") {
            navigate("/admin/orders", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
          return;
        }
      }

      // LOGIN 2FA
      else {
        const data = await verify2FALogin(email, code2fa);
        console.log(data);

        if (data.user.rol === "ADMIN") {
          navigate("/admin/products", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

        return;
      }

    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        {show2FA
          ? "Verificación 2FA"
          : "Iniciar Sesión"}
      </h2>

      <form onSubmit={handleSubmit}>
        {!show2FA ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px"
              }}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px"
              }}
            />
          </>
        ) : (
          <>
            <p>
              Introduce el código de tu app
            </p>

            <input
              type="text"
              placeholder="000000"
              value={code2fa}
              onChange={(e) =>
                setCode2fa(e.target.value)
              }
              maxLength="6"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                textAlign: "center",
                fontSize: "20px"
              }}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px"
          }}
        >
          {loading
            ? "Cargando..."
            : show2FA
            ? "Verificar"
            : "Entrar"}
        </button>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {!show2FA && (
          <div style={{ marginTop: "20px" }}>
            <p>
              <Link to="/forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>

            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/register">
                Regístrate aquí
              </Link>
            </p>
          </div>
        )}

        {show2FA && (
          <button
            type="button"
            onClick={() =>
              setShow2FA(false)
            }
            style={{
              width: "100%",
              marginTop: "10px"
            }}
          >
            Volver
          </button>
        )}
      </form>
    </div>
  );
}