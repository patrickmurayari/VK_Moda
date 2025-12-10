import { useState, useEffect } from 'react';
import { FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

function Notificacion({ tipo = 'info', titulo, mensaje, duracion = 4000, onCerrar }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duracion > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onCerrar) onCerrar();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [duracion, onCerrar]);

  if (!visible) return null;

  const estilos = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icono: <FiCheck className="text-green-600 text-2xl flex-shrink-0" />,
      titulo: 'text-green-900',
      texto: 'text-green-700',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icono: <FiAlertCircle className="text-red-600 text-2xl flex-shrink-0" />,
      titulo: 'text-red-900',
      texto: 'text-red-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icono: <FiInfo className="text-blue-600 text-2xl flex-shrink-0" />,
      titulo: 'text-blue-900',
      texto: 'text-blue-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icono: <FiAlertCircle className="text-yellow-600 text-2xl flex-shrink-0" />,
      titulo: 'text-yellow-900',
      texto: 'text-yellow-700',
    },
  };

  const estilo = estilos[tipo] || estilos.info;

  return (
    <div
      className={`fixed top-6 right-6 max-w-md ${estilo.bg} border-2 ${estilo.border} 
                   rounded-lg p-4 shadow-elegant-lg animate-slide-in-right z-50`}
      role="alert"
    >
      <div className="flex gap-4">
        {estilo.icono}
        <div className="flex-1">
          {titulo && (
            <h3 className={`font-semibold ${estilo.titulo}`}>{titulo}</h3>
          )}
          <p className={`text-sm ${estilo.texto} ${titulo ? 'mt-1' : ''}`}>
            {mensaje}
          </p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            if (onCerrar) onCerrar();
          }}
          className={`flex-shrink-0 ${estilo.texto} hover:opacity-70 transition-opacity`}
          aria-label="Cerrar notificación"
        >
          <FiX className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default Notificacion;
