import { useState } from 'react';
import { FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';

function FormularioContacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const [estado, setEstado] = useState('idle'); // idle, loading, success, error
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setEstado('error');
      setMensaje('Por favor completa los campos requeridos');
      setTimeout(() => setEstado('idle'), 3000);
      return;
    }

    setEstado('loading');

    // Simular envío (en producción, conectar a un backend)
    setTimeout(() => {
      setEstado('success');
      setMensaje('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      });
      setTimeout(() => setEstado('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-primary-900 font-semibold mb-2 text-sm">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg 
                       transition-all duration-300 focus:border-accent-600 
                       focus:shadow-elegant focus:outline-none
                       hover:border-neutral-400 text-neutral-800"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-primary-900 font-semibold mb-2 text-sm">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg 
                       transition-all duration-300 focus:border-accent-600 
                       focus:shadow-elegant focus:outline-none
                       hover:border-neutral-400 text-neutral-800"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-primary-900 font-semibold mb-2 text-sm">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+54 11 2607-3801"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg 
                       transition-all duration-300 focus:border-accent-600 
                       focus:shadow-elegant focus:outline-none
                       hover:border-neutral-400 text-neutral-800"
          />
        </div>

        {/* Asunto */}
        <div>
          <label className="block text-primary-900 font-semibold mb-2 text-sm">
            Asunto
          </label>
          <input
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            placeholder="Consulta sobre productos"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg 
                       transition-all duration-300 focus:border-accent-600 
                       focus:shadow-elegant focus:outline-none
                       hover:border-neutral-400 text-neutral-800"
          />
        </div>

        {/* Mensaje */}
        <div>
          <label className="block text-primary-900 font-semibold mb-2 text-sm">
            Mensaje *
          </label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Cuéntanos tu consulta o sugerencia..."
            rows="5"
            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg 
                       transition-all duration-300 focus:border-accent-600 
                       focus:shadow-elegant focus:outline-none
                       hover:border-neutral-400 text-neutral-800 resize-none"
          />
        </div>

        {/* Mensaje de Estado */}
        {estado === 'success' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 
                          rounded-lg animate-fade-in-up">
            <FiCheck className="text-green-600 text-xl flex-shrink-0" />
            <p className="text-green-700 font-medium text-sm">{mensaje}</p>
          </div>
        )}

        {estado === 'error' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 
                          rounded-lg animate-fade-in-up">
            <FiAlertCircle className="text-red-600 text-xl flex-shrink-0" />
            <p className="text-red-700 font-medium text-sm">{mensaje}</p>
          </div>
        )}

        {/* Botón Enviar */}
        <button
          type="submit"
          disabled={estado === 'loading'}
          className="w-full px-6 py-3 bg-primary-900 text-white font-semibold rounded-lg 
                     transition-all duration-300 hover:bg-accent-600 
                     hover:shadow-elegant-lg transform hover:scale-105 
                     active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {estado === 'loading' ? (
            <>
              <div className="animate-spin">⏳</div>
              Enviando...
            </>
          ) : (
            <>
              <FiSend className="text-lg" />
              Enviar Mensaje
            </>
          )}
        </button>

        <p className="text-center text-neutral-500 text-xs">
          Los campos marcados con * son obligatorios
        </p>
      </form>
    </div>
  );
}

export default FormularioContacto;
