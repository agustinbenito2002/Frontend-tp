import { useEffect, useState } from "react";
import AuthPage from "./authpage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [objetos, setObjetos] = useState([]);
  const [selectedObjeto, setSelectedObjeto] = useState(null);
  const [duenio, setDuenio] = useState(null);

  // Popup agregar objeto
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newObjeto, setNewObjeto] = useState({
    nombre: "",
    caracteristicas: "",
    id_duenio: "",
    estado: true,
  });

  //-------------------------------
  // 🔵 Cargar lista de objetos
  //-------------------------------
  const fetchObjetos = async (jwt) => {
    try {
      const res = await fetch("http://localhost:3001/api/objetos");

      if (!res.ok) throw new Error("Error cargando objetos");

      const data = await res.json();
      setObjetos(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  //-------------------------------------
  // 🟢 Login exitoso
  //-------------------------------------
  const handleUserLogin = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    fetchObjetos(jwt);
  };

  //-------------------------------------
  // 🚪 Cerrar sesión
  //-------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setObjetos([]);
  };

  //-------------------------------------
  // 🔵 Auto-cargar objetos si ya hay token
  //-------------------------------------
  useEffect(() => {
    if (token) fetchObjetos(token);
  }, [token]);

  //-------------------------------------
  // 🟣 Cargar dueño cuando selecciono objeto
  //-------------------------------------
  useEffect(() => {
    if (!selectedObjeto) return;

    fetch(`http://localhost:3001/api/duenios/${selectedObjeto.id_duenio}`)
      .then((res) => res.json())
      .then((data) => setDuenio(data))
      .catch((err) => console.error("Error cargando dueño:", err));
  }, [selectedObjeto]);

  //-------------------------------------
  // 🟠 Guardar nuevo objeto
  //-------------------------------------
  const handleAddObjeto = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/objetos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newObjeto),
      });

      if (!res.ok) return alert("Error guardando objeto");

      // Limpiar formulario
      setShowAddPopup(false);
      setNewObjeto({
        nombre: "",
        caracteristicas: "",
        id_duenio: "",
        estado: true,
      });

      fetchObjetos(token);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  //-------------------------------------
  // 🟥 Si no está logueado → mostrar login
  //-------------------------------------
  if (!token) return <AuthPage onLogin={handleUserLogin} />;

  //-------------------------------------
  // 🟩 Render principal
  //-------------------------------------
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Objetos Perdidos</h2>

      {/* Botones superiores */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setShowAddPopup(true)}
          style={{
            padding: "10px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Agregar Objeto
        </button>

        <button
          onClick={logout}
          style={{
            padding: "10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* LISTA DE OBJETOS */}
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
            {obj.nombre} ({obj.estado ? "Perdido" : "Recuperado"})
          </button>
        ))}
      </div>

      {/* INFO PANEL */}
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
          <p><strong>Nombre:</strong> {selectedObjeto.nombre}</p>
          <p><strong>Características:</strong> {selectedObjeto.caracteristicas}</p>
          <p><strong>Estado:</strong> {selectedObjeto.estado ? "Perdido" : "Recuperado"}</p>

          <h3>Dueño del objeto</h3>
          {duenio ? (
            <>
              <p><strong>Nombre:</strong> {duenio.nombre}</p>
              <p><strong>Teléfono:</strong> {duenio.telefono}</p>
            </>
          ) : (
            <p>Cargando dueño…</p>
          )}
        </div>
      )}

      {/* POPUP AGREGAR */}
      {showAddPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "350px",
              background: "white",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h3>Agregar Objeto</h3>

            <input
              type="text"
              placeholder="Nombre"
              value={newObjeto.nombre}
              onChange={(e) =>
                setNewObjeto({ ...newObjeto, nombre: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <textarea
              placeholder="Características"
              value={newObjeto.caracteristicas}
              onChange={(e) =>
                setNewObjeto({
                  ...newObjeto,
                  caracteristicas: e.target.value,
                })
              }
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <input
              type="number"
              placeholder="ID Dueño"
              value={newObjeto.id_duenio}
              onChange={(e) =>
                setNewObjeto({
                  ...newObjeto,
                  id_duenio: Number(e.target.value),
                })
              }
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label>
              Estado:
              <select
                value={newObjeto.estado}
                onChange={(e) =>
                  setNewObjeto({
                    ...newObjeto,
                    estado: e.target.value === "true",
                  })
                }
                style={{ marginLeft: "10px" }}
              >
                <option value="true">Perdido</option>
                <option value="false">Recuperado</option>
              </select>
            </label>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={handleAddObjeto}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Guardar
              </button>

              <button
                onClick={() => setShowAddPopup(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;



