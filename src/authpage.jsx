import { useState } from "react";

export default function AuthPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    onLogin(data.email);
    window.location.href = "/objetos"; // redirige a sección de objetos
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Usuario registrado correctamente. Ahora inicia sesión.");
    setIsRegister(false);
    setNombre("");
    setEmail("");
    setPassword("");
  };

  const handleCancel = () => {
    // Puedes limpiar los campos o cerrar el modal
    setNombre("");
    setEmail("");
    setPassword("");
    setIsRegister(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "red",
          padding: "30px",
          borderRadius: "10px",
          width: "350px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {isRegister ? "Registrar usuario" : "Iniciar sesión"}
        </h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
              required
            />
          )}

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              cursor: "pointer",
              background: isRegister ? "#00b894" : "#0984e3",
              color: "black",
              border: "none",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              flex: 1,
              padding: "10px",
              marginRight: "5px",
              cursor: "pointer",
              background: "#050504ff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            {isRegister ? "Iniciar sesión" : "Registrarse"}
          </button>

          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: "10px",
              marginLeft: "5px",
              cursor: "pointer",
              background: "#000000ff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
