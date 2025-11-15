import { useEffect, useState } from "react";
import AuthPage from "./authpage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [objetos, setObjetos] = useState([]);
  const [selectedObjeto, setSelectedObjeto] = useState(null);
  const [duenio, setDuenio] = useState(null);

  // Dueños cargados desde BD
  const [duenios, setDuenios] = useState([]);

  // Popup agregar objeto
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newObjeto, setNewObjeto] = useState({
    nombre: "",
    caracteristicas: "",
    id_duenio: "",
    estado: true,
  });

  // Modo creación de dueño nuevo
  const [crearNuevoDuenio, setCrearNuevoDuenio] = useState(false);
  const [nuevoDuenioData, setNuevoDuenioData] = useState({
    duenio: "",
    telefono: "",
    mail: "",
    direccion: "",
  });

  // --------------------------------
  // Cargar objetos
  // --------------------------------
  const fetchObjetos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/objetos");
      if (!res.ok) throw new Error("Error cargando objetos");
      const data = await res.json();
      setObjetos(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // --------------------------------
  // Cargar dueños
  // --------------------------------
  const fetchDuenios = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/duenios");
      const data = await res.json();
      setDuenios(data);
    } catch (err) {
      console.error("Error cargando dueños:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchObjetos();
      fetchDuenios();
    }
  }, [token]);

  // Cargar dueño cuando selecciono objeto
  useEffect(() => {
    if (!selectedObjeto) return;

    fetch(`http://localhost:3001/api/duenios/${selectedObjeto.id_duenio}`)
      .then((res) => res.json())
      .then((data) => setDuenio(data))
      .catch((err) => console.error("Error cargando dueño:", err));
  }, [selectedObjeto]);

  // --------------------------------
  // Login
  // --------------------------------
  const handleUserLogin = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setObjetos([]);
  };

  // --------------------------------
  // Guardar nuevo objeto
  // --------------------------------
  const handleAddObjeto = async () => {
    let duenioId = newObjeto.id_duenio;

    // 🔵 Si se está creando un dueño nuevo
    if (crearNuevoDuenio) {
      const resNuevo = await fetch("http://localhost:3001/api/duenios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoDuenioData),
      });

      if (!resNuevo.ok) {
        alert("Error creando dueño");
        return;
      }

      const nuevo = await resNuevo.json();
      duenioId = nuevo.id_duenio;
    }

    // 🟢 Guardar objeto
    const res = await fetch("http://localhost:3001/api/objetos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newObjeto, id_duenio: duenioId }),
    });

    if (!res.ok) {
      alert("Error guardando objeto");
      return;
    }

    setShowAddPopup(false);
    setNewObjeto({ nombre: "", caracteristicas: "", id_duenio: "", estado: true });
    setCrearNuevoDuenio(false);

    fetchObjetos();
    fetchDuenios();
  };

  // --------------------------------
  // Borrar objeto
  // --------------------------------
  const borrarObjeto = async () => {
    if (!selectedObjeto) return;

    const confirmar = confirm("¿Seguro deseas borrar este objeto?");
    if (!confirmar) return;

    const res = await fetch(`http://localhost:3001/api/objetos/${selectedObjeto.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Error eliminando objeto");
      return;
    }

    setSelectedObjeto(null);
    fetchObjetos();
  };

  // --------------------------------
  // Render
  // --------------------------------
  if (!token) return <AuthPage onLogin={handleUserLogin} />;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Objetos Perdidos</h2>

      {/* Botones */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setShowAddPopup(true)}
          style={{
            padding: "10px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "6px",
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
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Lista de objetos */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {objetos.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setSelectedObjeto(obj)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #888",
              background: selectedObjeto?.id === obj.id ? "#00a8ff" : "#eee",
              color: selectedObjeto?.id === obj.id ? "white" : "black",
            }}
          >
            {obj.nombre} ({obj.estado ? "Perdido" : "Recuperado"})
          </button>
        ))}
      </div>

      {/* Panel info del objeto */}
      {selectedObjeto && (
        <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #ccc" }}>
          <h3>Objeto seleccionado</h3>
          <p><strong>Nombre:</strong> {selectedObjeto.nombre}</p>
          <p><strong>Características:</strong> {selectedObjeto.caracteristicas}</p>
          <p><strong>Estado:</strong> {selectedObjeto.estado ? "Perdido" : "Recuperado"}</p>

          <h3>Dueño</h3>
          {duenio ? (
            <>
              <p><strong>Nombre:</strong> {duenio.duenio}</p>
              <p><strong>Teléfono:</strong> {duenio.telefono}</p>
              <p><strong>Dirección:</strong> {duenio.direccion}</p>
            </>
          ) : (
            <p>Cargando dueño…</p>
          )}

          <button
            onClick={borrarObjeto}
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "darkred",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Borrar Objeto
          </button>
        </div>
      )}

      {/* Popup agregar */}
      {showAddPopup && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "350px", background: "white", padding: "20px", borderRadius: "10px" }}>
            <h3>Agregar Objeto</h3>

            <input
              type="text"
              placeholder="Nombre"
              value={newObjeto.nombre}
              onChange={(e) => setNewObjeto({ ...newObjeto, nombre: e.target.value })}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <textarea
              placeholder="Características"
              value={newObjeto.caracteristicas}
              onChange={(e) =>
                setNewObjeto({ ...newObjeto, caracteristicas: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <label> Dueño: </label>
            <select
              value={crearNuevoDuenio ? "nuevo" : newObjeto.id_duenio}
              onChange={(e) => {
                if (e.target.value === "nuevo") {
                  setCrearNuevoDuenio(true);
                } else {
                  setCrearNuevoDuenio(false);
                  setNewObjeto({ ...newObjeto, id_duenio: Number(e.target.value) });
                }
              }}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <option value="">Seleccione un dueño</option>
              {duenios.map((d) => (
                <option key={d.id_duenio} value={d.id_duenio}>
                  {d.duenio}
                </option>
              ))}
              <option value="nuevo">➕ Crear nuevo dueño</option>
            </select>

            {/* Campos si crea un dueño nuevo */}
            {crearNuevoDuenio && (
              <div style={{ marginBottom: "10px", padding: "10px", border: "1px solid #aaa" }}>
                <input
                  type="text"
                  placeholder="Nombre del dueño"
                  value={nuevoDuenioData.duenio}
                  onChange={(e) =>
                    setNuevoDuenioData({ ...nuevoDuenioData, duenio: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={nuevoDuenioData.telefono}
                  onChange={(e) =>
                    setNuevoDuenioData({ ...nuevoDuenioData, telefono: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <input
                  type="text"
                  placeholder="Mail"
                  value={nuevoDuenioData.mail}
                  onChange={(e) =>
                    setNuevoDuenioData({ ...nuevoDuenioData, mail: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px" }}
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={nuevoDuenioData.direccion}
                  onChange={(e) =>
                    setNuevoDuenioData({ ...nuevoDuenioData, direccion: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px" }}
                />
              </div>
            )}

            <label>Estado:</label>
            <select
              value={newObjeto.estado}
              onChange={(e) =>
                setNewObjeto({ ...newObjeto, estado: e.target.value === "true" })
              }
              style={{ width: "100%" }}
            >
              <option value="true">Perdido</option>
              <option value="false">Recuperado</option>
            </select>

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
