import { useState } from "react";

export default function AuthPage({ apiUrl, onLogin, onObserverEnter }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  //-----------------------------
  // LOGIN
  //-----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!email || !password) {
      setMessage("Completa correo y contraseña para iniciar sesión.");
      setMessageType("error");
      return;
    }

    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Error al iniciar sesión.");
      setMessageType("error");
      return;
    }

    setMessage("Inicio de sesión correcto.");
    setMessageType("success");
    onLogin(data.token);
  };

  //-----------------------------
  // REGISTRO
  //-----------------------------
  const handleRegister = async (e) => {
    e.preventDefault();
    clearMessage();

    if (!nombre || !email || !password) {
      setMessage("Completa todos los datos para registrarte.");
      setMessageType("error");
      return;
    }

    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "El registro falló. Intenta de nuevo.");
      setMessageType("error");
      return;
    }

    setMessage("Usuario registrado correctamente.");
    setMessageType("success");
    setNombre("");
    setEmail("");
    setPassword("");
    setIsRegister(false);

    if (data.token) {
      onLogin(data.token);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 18 }}>
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "100px",
          width: "350px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {isRegister ? "Registrar usuario" : "Iniciar sesión"}
        </h2>

        {message && (
          <div
            style={{
              marginBottom: "12px",
              padding: "12px",
              borderRadius: "8px",
              background: messageType === "success" ? "#d4edda" : "#f8d7da",
              color: messageType === "success" ? "#155724" : "#721c24",
              border: messageType === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
            }}
          >
            {message}
          </div>
        )}

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
          onClick={() => {
            clearMessage();
            setIsRegister(!isRegister);
          }}
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

