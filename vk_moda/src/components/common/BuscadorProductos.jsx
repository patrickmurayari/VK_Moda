import { useState, useMemo, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

function BuscadorProductos({ productos, onFiltro }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');

  const productosFiltrados = useMemo(() => {
    let resultado = productos;

    if (busqueda.trim()) {
      resultado = resultado.filter(
        (producto) =>
          producto.name.toLowerCase().includes(busqueda.toLowerCase()) ||
          (producto.description &&
            producto.description.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    if (filtroActivo !== 'todos') {
      resultado = resultado.filter(
        (producto) => producto.categoria === filtroActivo
      );
    }

    return resultado;
  }, [busqueda, filtroActivo, productos]);

  useEffect(() => {
    if (onFiltro) {
      onFiltro(productosFiltrados);
    }
  }, [productosFiltrados, onFiltro]);

  const handleLimpiar = () => {
    setBusqueda('');
    setFiltroActivo('todos');
  };

  const categorias = [
    { id: 'todos', nombre: 'Todos' },
    { id: 'vestidos', nombre: 'Vestidos' },
    { id: 'bolsos', nombre: 'Bolsos' },
    { id: 'indumentaria', nombre: 'Indumentaria' },
    { id: 'joyeria', nombre: 'Joyería' },
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="relative">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 
                              text-neutral-400 text-xl" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border-2 border-neutral-300 rounded-lg 
                       transition-all duration-300 focus:border-accent-600 
                       focus:shadow-elegant focus:outline-none
                       hover:border-neutral-400 text-neutral-800"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 
                         text-neutral-400 hover:text-primary-900 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <FiX className="text-xl" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => setFiltroActivo(categoria.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              filtroActivo === categoria.id
                ? 'bg-accent-600 text-white shadow-elegant'
                : 'bg-neutral-200 text-primary-900 hover:bg-neutral-300'
            }`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-neutral-600 font-medium">
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
        </p>
        {(busqueda || filtroActivo !== 'todos') && (
          <button
            onClick={handleLimpiar}
            className="text-accent-600 hover:text-primary-900 font-medium 
                       transition-colors duration-300 flex items-center gap-1"
          >
            <FiX className="text-lg" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}

export default BuscadorProductos;
