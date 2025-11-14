import { useEffect, useState } from "react";
import AuthPage from "./authpage"; 
import home from "./home";

function App() {
  const [objetos, setObjetos] = useState([]);
  const [selectedObjeto, setSelectedObjeto] = useState(null);
  const [duenio, setDuenio] = useState(null);
// App.jsx
  // Mostrar página de bienvenida si el token es "welcome
  const handleUserLogin = (user) => {
    console.log("Usuario logueado:", user);
  };

  return <AuthPage onLogin={handleUserLogin} />;


  // Mostrar login si no hay token
  if (!localStorage.getItem("token")) {
    return <AuthPage />;
  }

  useEffect(() => {
    fetch("http://localhost:3001/api/objetos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Objetos cargados:", data);
        setObjetos(data);
      })
      .catch((err) => console.error("Error cargando objetos:", err));
  }, []);

  useEffect(() => {
    if (!selectedObjeto) return;

    const idDuenio = selectedObjeto.id_duenio;

    if (!idDuenio) {
      console.warn("El objeto no tiene id_duenio:", selectedObjeto);
      setDuenio(null);
      return;
    }

    fetch(`http://localhost:3001/api/duenios/${idDuenio}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dueño cargado:", data);
        setDuenio(data);
      })
      .catch((err) => console.error("Error cargando dueño:", err));
  }, [selectedObjeto]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Objetos</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {objetos.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setSelectedObjeto(obj)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #888",
              cursor: "pointer",
              background: selectedObjeto?.id === obj.id ? "#00a8ff" : "#eee",
              color: selectedObjeto?.id === obj.id ? "white" : "black",
            }}
          >
            {obj.nombre_object}
          </button>
        ))}
      </div>

      {selectedObjeto && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>Objeto seleccionado</h3>
          <p><strong>ID:</strong> {selectedObjeto.id}</p>
          <p><strong>Nombre:</strong> {selectedObjeto.nombre_object}</p>
          <p><strong>Características:</strong> {selectedObjeto.caracteristicas}</p>

          <h3>Dueño del objeto</h3>

          {duenio ? (
            <>
              <p><strong>ID Dueño:</strong> {duenio.id_duenio}</p>
              <p><strong>Nombre:</strong> {duenio.duenio}</p>
              <p><strong>Teléfono:</strong> {duenio.telefono}</p>
              <p><strong>Email:</strong> {duenio.mail}</p>
              <p><strong>Dirección:</strong> {duenio.direccion}</p>
            </>
          ) : (
            <p>Cargando dueño…</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
