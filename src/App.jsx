import { useEffect, useState } from "react";
import AuthPage from "./authpage";

function App() {
  const apiUrl = import.meta.env.REACT_APP_API_URL || "http://localhost:3001";
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isObserver, setIsObserver] = useState(localStorage.getItem("observer") === "true");
  const [objetos, setObjetos] = useState([]);
  const [selectedObjeto, setSelectedObjeto] = useState(null);
  const [duenio, setDuenio] = useState(null);

  // Nuevo estado para detalle modal
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  // Dueños cargados desde BD
  const [duenios, setDuenios] = useState([]);
  // búsqueda por nombre
  const [searchQuery, setSearchQuery] = useState("");

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
      const res = await fetch(`${apiUrl}/api/objetos`);
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
      const res = await fetch(`${apiUrl}/api/duenios`);
      const data = await res.json();
      setDuenios(data);
    } catch (err) {
      console.error("Error cargando dueños:", err);
    }
  };

  // Ejecutar fetch al iniciar sesión o entrar como observador
  useEffect(() => {
    if (token || isObserver) {
      fetchObjetos();
      fetchDuenios();
    }
  }, [token, isObserver]);

  // Cargar dueño cuando selecciono objeto
  useEffect(() => {
    if (!selectedObjeto) {
      setDuenio(null);
      return;
    }

    if (!selectedObjeto.id_duenio) {
      setDuenio(null);
      return;
    }

    fetch(`${apiUrl}/api/duenios/${selectedObjeto.id_duenio}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error cargando dueño");
        return res.json();
      })
      .then((data) => setDuenio(data))
      .catch((err) => {
        console.error("Error cargando dueño:", err);
        setDuenio(null);
      });
  }, [selectedObjeto]);

  // --------------------------------
  // Login
  // --------------------------------
  const handleUserLogin = (jwt) => {
    localStorage.setItem("token", jwt);
    // Si ingresó un usuario normal, asegurar que no quede modo observador
    localStorage.removeItem("observer");
    setIsObserver(false);
    setToken(jwt);
  };

  // entrar como observador (solo lectura)
  const handleObserverEnter = () => {
    localStorage.removeItem("token");
    setToken(null);
    localStorage.setItem("observer", "true");
    setIsObserver(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("observer");
    setToken(null);
    setIsObserver(false);
    setObjetos([]);
    setSearchQuery("");
  };

  // --------------------------------
  // Guardar nuevo objeto
  // --------------------------------
  const handleAddObjeto = async () => {
    if (!token) {
      alert("Acceso denegado: inicie sesión para agregar objetos");
      return;
    }
    let duenioId = newObjeto.id_duenio;

    // 🔵 Si se está creando un dueño nuevo
    if (crearNuevoDuenio) {
      const resNuevo = await fetch(`${apiUrl}/api/duenios`, {
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
    const res = await fetch(`${apiUrl}/api/objetos`, {
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
    if (!token) {
      alert("Acceso denegado: inicie sesión para borrar objetos");
      return;
    }
    if (!selectedObjeto) return;

    const confirmar = window.confirm("¿Seguro deseas borrar este objeto?");
    if (!confirmar) return;

    const res = await fetch(`${apiUrl}/api/objetos/${selectedObjeto.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Error eliminando objeto");
      return;
    }

    setSelectedObjeto(null);
    setDuenio(null);
    setShowDetailPopup(false);
    fetchObjetos();
  };

  // --------------------------------
  // Búsqueda
  // --------------------------------
  const filteredObjetos = objetos.filter((o) =>
    (o.nombre || "").toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // --------------------------------
  // Render
  // --------------------------------
  if (!token && !isObserver)
    return <AuthPage onLogin={handleUserLogin} onObserverEnter={handleObserverEnter} />;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {/* banner modo observador */}
      {isObserver && (
        <div style={{ marginBottom: "10px", padding: "8px", background: "#f7f7f7", borderRadius: "6px" }}>
          <strong>Modo observador</strong> — solo lectura. No puedes agregar, borrar o editar objetos.
        </div>
      )}
      <h2>Objetos Perdidos</h2>

      {/* Botones + Buscador */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        {/* Solo mostrar Agregar si hay sesión válida (no observador) */}
        {token && (
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
        )}

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

        {/* Buscador */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre..."
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              minWidth: 220,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                padding: "8px 10px",
                background: "#ddd",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista de objetos como tarjetas */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // permite que las tarjetas se pongan en fila y después bajen
          justifyContent: "flex-start",
          gap: "16px",
        }}
      >
        {filteredObjetos.map((obj) => (
          <div
            key={obj.id}
            onClick={() => {
              setSelectedObjeto(obj);
              setShowDetailPopup(true);
            }}
            role="button"
            tabIndex={0}
            style={{
              cursor: "pointer",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              minHeight: "120px",
              flex: "0 0 220px", // ancho fijo base para que se alineen en una fila antes de bajar
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#111" }}>{obj.nombre}</div>
            <div style={{ color: "#666", fontSize: "13px", flex: 1 }}>
              {obj.caracteristicas ? (
                <span>
                  {obj.caracteristicas.length > 80
                    ? obj.caracteristicas.slice(0, 80) + "..."
                    : obj.caracteristicas}
                </span>
              ) : (
                <span style={{ fontStyle: "italic" }}>Sin descripción</span>
              )}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "6px 8px",
                borderRadius: "14px",
                background: obj.estado ? "#ff6b6b" : "#2ecc71",
                color: "#fff",
                fontWeight: "600",
                fontSize: "12px",
                alignSelf: "flex-start",
              }}
            >
              {obj.estado ? "Perdido" : "Recuperado"}
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados con la búsqueda */}
      {filteredObjetos.length === 0 && (
        <div style={{ marginTop: 20, color: "#555" }}>
          No se encontraron objetos con ese nombre.
        </div>
      )}

      {/* Popup detalle del objeto */}
      {showDetailPopup && selectedObjeto && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center",
            alignItems: "center", zIndex: 1000,
          }}
          onClick={() => {
            // cerrar al clickear el overlay
            setSelectedObjeto(null);
            setDuenio(null);
            setShowDetailPopup(false);
          }}
        >
          <div style={{ width: "420px", background: "white", padding: "20px", borderRadius: "10px", color: "#111" }}
               onClick={(e) => e.stopPropagation() /* evitar cerrar al clickear el contenido */}>
            <h3 style={{ color: "#111" }}>Detalle del objeto</h3>

            <p><strong>Nombre:</strong> {selectedObjeto.nombre}</p>
            <p><strong>Características:</strong> {selectedObjeto.caracteristicas}</p>
            <p><strong>Estado:</strong> {selectedObjeto.estado ? "Perdido" : "Recuperado"}</p>

            <h4>Dueño</h4>
            {duenio ? (
              <>
                <p><strong>Nombre:</strong> {duenio.duenio}</p>
                <p><strong>Teléfono:</strong> {duenio.telefono}</p>
                <p><strong>Dirección:</strong> {duenio.direccion}</p>
              </>
            ) : (
              <p>Cargando dueño…</p>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              {/* Solo mostrar borrar si hay token (usuario logueado) */}
              {token && (
                <button
                  onClick={borrarObjeto}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#c0392b", // rojo contrastante
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Borrar Objeto
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedObjeto(null);
                  setDuenio(null);
                  setShowDetailPopup(false);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#333", // oscuro y contrastante
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup agregar */}
      {showAddPopup && token && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            setShowAddPopup(false);
            setCrearNuevoDuenio(false);
          }}
        >
          <div style={{ width: "350px", background: "white", padding: "20px", borderRadius: "10px", color: "#111" }}
               onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#111" }}>Agregar Objeto</h3>

            <input
              type="text"
              placeholder="Nombre"
              value={newObjeto.nombre}
              onChange={(e) => setNewObjeto({ ...newObjeto, nombre: e.target.value })}
              style={{ width: "100%", marginBottom: "10px", color: "#111" }}
            />

            <textarea
              placeholder="Características"
              value={newObjeto.caracteristicas}
              onChange={(e) =>
                setNewObjeto({ ...newObjeto, caracteristicas: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", color: "#111" }}
            />

            <label style={{ color: "#111" }}> Dueño: </label>
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
              style={{ width: "100%", marginBottom: "10px", color: "#111" }}
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
                  style={{ width: "100%", marginBottom: "5px", color: "#111" }}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={nuevoDuenioData.telefono}
                  onChange={(e) =>
                    setNuevoDuenioData({ ...nuevoDuenioData, telefono: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px", color: "#111" }}
                />
                <input
                  type="text"
                  placeholder="Mail"
                  value={nuevoDuenioData.mail}
                  onChange={(e) =>
                    setNuevoDuenioData({ ...nuevoDuenioData, mail: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px", color: "#111" }}
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={nuevoDuenioData.direccion}
                  onChange={(e) =>
                    setNuevoDuenioData({ ...nuevoDuenioData, direccion: e.target.value })
                  }
                  style={{ width: "100%", marginBottom: "5px", color: "#111" }}
                />
              </div>
            )}

            <label style={{ color: "#111" }}>Estado:</label>
            <select
              value={String(newObjeto.estado)}
              onChange={(e) =>
                setNewObjeto({ ...newObjeto, estado: e.target.value === "true" })
              }
              style={{ width: "100%", color: "#111" }}
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
                  background: "#c0392b",
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
