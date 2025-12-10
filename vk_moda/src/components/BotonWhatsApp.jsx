import { useState } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';

function BotonWhatsApp() {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const mensajesPredefinidos = [
    { texto: 'Hola, tengo una consulta', emoji: '💬' },
    { texto: 'Quiero hacer un pedido', emoji: '🛍️' },
    { texto: 'Información sobre confecciones', emoji: '✂️' },
    { texto: 'Consulta sobre arreglos', emoji: '🧵' },
  ];

  const enviarMensaje = (mensaje) => {
    const numeroWhatsApp = '541126073801';
    const mensajeEncoded = encodeURIComponent(mensaje);
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeEncoding}`;
    window.open(url, '_blank');
    setMostrarMenu(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Menú de Mensajes */}
      {mostrarMenu && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-elegant-lg 
                        p-3 space-y-2 w-64 animate-scale-in">
          <p className="text-sm font-semibold text-primary-900 px-2 py-1">
            ¿En qué podemos ayudarte?
          </p>
          {mensajesPredefinidos.map((item, index) => (
            <button
              key={index}
              onClick={() => enviarMensaje(item.texto)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 
                         transition-colors duration-300 text-sm text-neutral-700
                         flex items-center gap-2 group"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="group-hover:text-accent-600 transition-colors">
                {item.texto}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Botón Principal */}
      <button
        onClick={() => setMostrarMenu(!mostrarMenu)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full 
                   flex items-center justify-center shadow-elegant-lg 
                   transition-all duration-300 transform hover:scale-110 active:scale-95
                   relative group"
        aria-label="Abrir WhatsApp"
      >
        {mostrarMenu ? (
          <FiX className="text-2xl" />
        ) : (
          <>
            <FiMessageCircle className="text-2xl" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full 
                             animate-pulse"></span>
          </>
        )}
      </button>

      {/* Tooltip */}
      {!mostrarMenu && (
        <div className="absolute bottom-20 right-0 bg-primary-900 text-white px-3 py-2 
                        rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 pointer-events-none">
          ¿Necesitas ayuda?
        </div>
      )}
    </div>
  );
}

export default BotonWhatsApp;
