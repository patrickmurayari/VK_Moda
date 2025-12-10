import { useState } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function GaleriaProductos({ productos }) {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [indiceActual, setIndiceActual] = useState(0);

  const abrirGaleria = (index) => {
    setImagenSeleccionada(index);
    setIndiceActual(index);
  };

  const cerrarGaleria = () => {
    setImagenSeleccionada(null);
  };

  const irAnterior = () => {
    setIndiceActual((prev) => (prev - 1 + productos.length) % productos.length);
  };

  const irSiguiente = () => {
    setIndiceActual((prev) => (prev + 1) % productos.length);
  };

  // Manejar teclas del teclado
  const manejarTeclas = (e) => {
    if (imagenSeleccionada === null) return;
    if (e.key === 'ArrowLeft') irAnterior();
    if (e.key === 'ArrowRight') irSiguiente();
    if (e.key === 'Escape') cerrarGaleria();
  };

  return (
    <>
      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {productos.map((producto, index) => (
          <div
            key={index}
            className="group cursor-pointer"
            onClick={() => abrirGaleria(index)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-elegant 
                            hover:shadow-elegant-lg transition-all duration-300">
              <img
                src={producto.image}
                alt={producto.name}
                className="w-full h-64 md:h-72 object-cover transition-transform 
                           duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 
                              transition-colors duration-300 flex items-center 
                              justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity 
                                duration-300">
                  <div className="bg-accent-600 text-white px-6 py-3 rounded-lg 
                                  font-semibold text-sm">
                    Ver Imagen
                  </div>
                </div>
              </div>
            </div>
            <h3 className="mt-4 text-primary-900 font-semibold text-center">
              {producto.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal de Galería */}
      {imagenSeleccionada !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={cerrarGaleria}
          onKeyDown={manejarTeclas}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden 
                       shadow-elegant-hover animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen Principal */}
            <div className="relative bg-black">
              <img
                src={productos[indiceActual].image}
                alt={productos[indiceActual].name}
                className="w-full h-auto max-h-96 md:max-h-[600px] object-contain"
              />

              {/* Botón Cerrar */}
              <button
                onClick={cerrarGaleria}
                className="absolute top-4 right-4 bg-accent-600 text-white p-2 
                           rounded-full hover:bg-primary-900 transition-colors 
                           duration-300 z-10"
                aria-label="Cerrar galería"
              >
                <FiX className="text-2xl" />
              </button>

              {/* Botones de Navegación */}
              {productos.length > 1 && (
                <>
                  <button
                    onClick={irAnterior}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 
                               bg-accent-600 text-white p-2 rounded-full 
                               hover:bg-primary-900 transition-colors duration-300 
                               z-10"
                    aria-label="Imagen anterior"
                  >
                    <FiChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={irSiguiente}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 
                               bg-accent-600 text-white p-2 rounded-full 
                               hover:bg-primary-900 transition-colors duration-300 
                               z-10"
                    aria-label="Siguiente imagen"
                  >
                    <FiChevronRight className="text-2xl" />
                  </button>
                </>
              )}
            </div>

            {/* Información del Producto */}
            <div className="p-6">
              <h2 className="text-2xl font-elegant font-bold text-primary-900 mb-2">
                {productos[indiceActual].name}
              </h2>
              <p className="text-neutral-600 mb-4">
                Imagen {indiceActual + 1} de {productos.length}
              </p>

              {/* Miniaturas */}
              {productos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productos.map((producto, index) => (
                    <button
                      key={index}
                      onClick={() => setIndiceActual(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden 
                                 transition-all duration-300 border-2 ${
                                   indiceActual === index
                                     ? 'border-accent-600 scale-105'
                                     : 'border-neutral-300 hover:border-accent-600'
                                 }`}
                    >
                      <img
                        src={producto.image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GaleriaProductos;
