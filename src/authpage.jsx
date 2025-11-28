import { useState } from "react";

export default function AuthPage({ onLogin, onObserverEnter }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //-----------------------------
  // LOGIN
  //-----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.error);

    onLogin(data.token);
  };

  //-----------------------------
  // REGISTRO
  //-----------------------------
  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert("Usuario registrado correctamente.");
    setIsRegister(false);
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 18 }}>
      <div
        style={{
          background: "white",
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
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {isRegister ? "Registrar" : "Iniciar sesión"}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
            background: "#dfe6e9",
            border: "none",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          {isRegister ? "Volver a iniciar sesión" : "Crear cuenta"}
        </button>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          onClick={onObserverEnter}
          style={{
            flex: 1,
            padding: "10px",
            background: "#2c3e50",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          Entrar como Observador
        </button>
      </div>
    </div>
  );
}

