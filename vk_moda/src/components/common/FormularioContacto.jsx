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

  const [estado, setEstado] = useState('idle');
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
    
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setEstado('error');
      setMensaje('Por favor completa los campos requeridos');
      setTimeout(() => setEstado('idle'), 3000);
      return;
    }

    setEstado('loading');

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-semibold text-primary-900 mb-2">
          Nombre *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg 
                     transition-all duration-300 focus:border-accent-600 
                     focus:shadow-elegant focus:outline-none
                     hover:border-neutral-400"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-primary-900 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg 
                     transition-all duration-300 focus:border-accent-600 
                     focus:shadow-elegant focus:outline-none
                     hover:border-neutral-400"
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-semibold text-primary-900 mb-2">
          Teléfono
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+54 11 2607-3801"
          className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg 
                     transition-all duration-300 focus:border-accent-600 
                     focus:shadow-elegant focus:outline-none
                     hover:border-neutral-400"
        />
      </div>

      <div>
        <label htmlFor="asunto" className="block text-sm font-semibold text-primary-900 mb-2">
          Asunto
        </label>
        <input
          type="text"
          id="asunto"
          name="asunto"
          value={formData.asunto}
          onChange={handleChange}
          placeholder="Asunto del mensaje"
          className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg 
                     transition-all duration-300 focus:border-accent-600 
                     focus:shadow-elegant focus:outline-none
                     hover:border-neutral-400"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-semibold text-primary-900 mb-2">
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Tu mensaje aquí..."
          rows="5"
          className="w-full px-4 py-2 border-2 border-neutral-300 rounded-lg 
                     transition-all duration-300 focus:border-accent-600 
                     focus:shadow-elegant focus:outline-none
                     hover:border-neutral-400 resize-none"
        ></textarea>
      </div>

      {mensaje && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          estado === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {estado === 'success' ? (
            <FiCheck className="text-lg flex-shrink-0" />
          ) : (
            <FiAlertCircle className="text-lg flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{mensaje}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={estado === 'loading'}
        className="w-full px-6 py-3 bg-primary-900 text-white font-medium rounded-lg 
                   transition-all duration-300 hover:bg-accent-600 hover:shadow-elegant-lg 
                   transform hover:scale-105 active:scale-95 disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {estado === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Enviando...
          </>
        ) : (
          <>
            <FiSend className="text-lg" />
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
}

export default FormularioContacto;
