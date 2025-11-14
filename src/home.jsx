export default function Home() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div
      style={{
        padding: 40,
        color: "white",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <h1>Bienvenido, usuario logueado</h1>
      <p>Puedes continuar con el sistema de objetos perdidos.</p>

      <button
        onClick={logout}
        style={{
          padding: "10px 20px",
          background: "#e84118",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          color: "white",
          marginTop: 20,
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
