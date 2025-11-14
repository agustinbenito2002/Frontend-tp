import { useEffect, useState } from "react";

function App() {
  const [objetos, setObjetos] = useState([]);
  const [selectedObjeto, setSelectedObjeto] = useState(null);
  const [duenio, setDuenio] = useState(null);

  // Cargar todos los objetos
  useEffect(() => {
    fetch("http://localhost:3001/api/objetos")
      .then((res) => res.json())
      .then((data) => {
        setObjetos(data);
      })
      .catch((err) => console.error("Error cargando objetos:", err));
  }, []);

  // Cargar dueño cuando cambia el objeto seleccionado
  useEffect(() => {
    if (!selectedObjeto) return;

    // Puede venir como duenioId o como "duenio"
    const id_Duenio =
      selectedObjeto.id_duenio !== undefined
        ? selectedObjeto.id_duenio
        : selectedObjeto.duenio;

    if (!id_Duenio) {
      console.warn("El objeto no tiene id de dueño:", selectedObjeto);
      setDuenio(null);
      return;
    }

    fetch(`http://localhost:3001/api/duenios/${id_Duenio}`)
      .then((res) => res.json())
      .then((data) => {
        setDuenio(data);
      })
      .catch((err) => console.error("Error cargando dueño:", err));
  }, [selectedObjeto]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Objetos</h2>

      {/* Lista de objetos como botones */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {objetos.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setSelectedObjeto(obj)}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {obj.nombre} {/* nombre correcto del objeto */}
          </button>
        ))}
      </div>

      {/* Detalle del objeto seleccionado */}
      {selectedObjeto && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h3>Objeto seleccionado</h3>
          <p>
            <strong>ID:</strong> {selectedObjeto.id}
          </p>
          <p>
            <strong>Nombre:</strong> {selectedObjeto.nombre}
          </p>

          <h3>Dueño</h3>
          {duenio ? (
            <>
              <p>
                <strong>ID:</strong> {duenio.id_duenio}
              </p>
              <p>
                <strong>Nombre:</strong> {duenio.duenio}
              </p>
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
