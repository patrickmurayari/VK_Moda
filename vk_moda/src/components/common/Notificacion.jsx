import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

function Notificacion({ tipo, mensaje, visible, onClose }) {
  if (!visible) return null;

  const estilos = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <FiCheck className="text-xl" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <FiX className="text-xl" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <FiAlertCircle className="text-xl" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <FiInfo className="text-xl" />
    }
  };

  const estilo = estilos[tipo] || estilos.info;

  return (
    <div className={`fixed top-20 right-6 ${estilo.bg} border-2 ${estilo.border} ${estilo.text} 
                    px-6 py-4 rounded-lg shadow-elegant-lg flex items-center gap-3 
                    animate-slide-in z-50 max-w-sm`}>
      {estilo.icon}
      <p className="font-medium">{mensaje}</p>
      <button
        onClick={onClose}
        className="ml-auto hover:opacity-70 transition-opacity"
      >
        <FiX className="text-lg" />
      </button>
    </div>
  );
}

export default Notificacion;
