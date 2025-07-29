import React, { useState, useEffect } from 'react';

function App() {
 const [cantidad, setCantidad] = useState(() => {
  return parseInt(localStorage.getItem('cantidad')) || 0;
});

const [impostores, setImpostores] = useState(() => {
  return parseInt(localStorage.getItem('impostores')) || 1;
});

const [jugadorActual, setJugadorActual] = useState(0);
const [fase, setFase] = useState('inicio');

const [jugadores, setJugadores] = useState(() => {
  return JSON.parse(localStorage.getItem('jugadores')) || [];
});

useEffect(() => {
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
}, [jugadores]);
   

useEffect(() => {
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
}, [jugadores]);


const [nombresSecretos, setNombresSecretos] = useState(() => {
  return JSON.parse(localStorage.getItem('nombresSecretos')) || [];
});

const [asignaciones, setAsignaciones] = useState([]);
const [nombreSecretoFinal, setNombreSecretoFinal] = useState('');

useEffect(() => {
  localStorage.setItem('cantidad', cantidad);
}, [cantidad]);

useEffect(() => {
  localStorage.setItem('impostores', impostores);
}, [impostores]);

useEffect(() => {
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
}, [jugadores]);

useEffect(() => {
  localStorage.setItem('nombresSecretos', JSON.stringify(nombresSecretos));
}, [nombresSecretos]);

useEffect(() => {
  localStorage.setItem('jugadores', JSON.stringify(jugadores));
}, [jugadores]);


  const comenzarJuego = () => {
    if (jugadores.length !== parseInt(cantidad) || nombresSecretos.length === 0) {
      alert("Completá todos los campos antes de empezar.");
      return;
    }

    const indices = [...Array(parseInt(cantidad)).keys()];
    const impostoresSeleccionados = [];

    while (impostoresSeleccionados.length < impostores) {
      const index = Math.floor(Math.random() * indices.length);
      const elegido = indices.splice(index, 1)[0];
      impostoresSeleccionados.push(elegido);
    }

    const nombreSecreto = nombresSecretos[Math.floor(Math.random() * nombresSecretos.length)];
    setNombreSecretoFinal(nombreSecreto);

    const asignacionesGeneradas = jugadores.map((nombre, index) => ({
      nombre,
      rol: impostoresSeleccionados.includes(index) ? 'Impostor' : 'Jugador',
    }));

    setAsignaciones(asignacionesGeneradas);
    setJugadorActual(0);
    setFase('juego');
  };

  const reiniciar = () => {
  setFase('inicio');
  setAsignaciones([]);
  setNombreSecretoFinal('');
  setJugadorActual(0);
};

  return (
    <div style={{ padding: 20 }}>
      {fase === 'inicio' && (
        <>
          <h2>Configuración del Juego</h2>

          <label>Cantidad de jugadores: </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => {
              setCantidad(e.target.value);
              const nuevosJugadores = Array.from({ length: e.target.value }, () => '');
              setJugadores(nuevosJugadores);
            }}
          /><br />

          <label>Cantidad de impostores: </label>
          <input
            type="number"
            value={impostores}
            onChange={(e) => setImpostores(parseInt(e.target.value))}
          /><br />

          <h3>Nombres de los jugadores</h3>
<textarea
  value={nombresSecretos.join(', ')}
  onChange={(e) => {
    const texto = e.target.value;
    const lista = texto.split(',').map(n => n.trim()).filter(n => n.length > 0);
    setNombresSecretos(lista);
    localStorage.setItem('nombresSecretos', JSON.stringify(lista)); // ✅ ESTA LÍNEA ES NUEVA
  }}

  placeholder="Escribí los nombres separados por coma: Juan, Pedro, Ana"
  style={{ width: '100%', height: '60px' }}
/>
<p>Total: {jugadores.length} jugador(es)</p>

          {jugadores.map((nombre, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Jugador ${index + 1}`}
              value={nombre}
              onChange={(e) => {
                const copia = [...jugadores];
                copia[index] = e.target.value;
                setJugadores(copia);
              }}
            />
          ))}

          <h3>Posibles nombres secretos (uno por jugador)</h3>
          <textarea
            rows={5}
            cols={30}
            placeholder="Escribí nombres separados por coma: Messi, Pelé, Maradona"
            onChange={(e) =>
              setNombresSecretos(e.target.value.split(',').map((n) => n.trim()))
            }
          /><br /><br />

          <button onClick={comenzarJuego}>Empezar</button>
        </>
      )}

      {fase === 'juego' && jugadorActual < jugadores.length && (
        <>
          <h2>{jugadores[jugadorActual]}</h2>
          <p>
            {asignaciones[jugadorActual].rol === 'Impostor'
              ? 'Sos el impostor. No sabés el nombre secreto.'
              : `Nombre secreto: ${nombreSecretoFinal}`}
          </p>
          <button onClick={() => setJugadorActual(jugadorActual + 1)}>Siguiente</button>
        </>
      )}

      {fase === 'juego' && jugadorActual >= jugadores.length && (
        <>
          <h2>Fin del juego</h2>
          <ul>
            {asignaciones.map((a, index) => (
              <li key={index}>
                {a.nombre}: {a.rol}
              </li>
            ))}
          </ul>
          <p>El nombre secreto era: <strong>{nombreSecretoFinal}</strong></p>
          <button onClick={reiniciar}>Reiniciar</button>
        </>
      )}
    </div>
  );



}

export default App;
