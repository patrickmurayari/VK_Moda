import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-8xl font-elegant font-bold text-primary-900 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">
          Página no encontrada
        </h2>
        <p className="text-neutral-600 text-lg mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-900 text-white font-medium rounded-lg transition-all duration-300 hover:bg-accent-600 hover:shadow-elegant-lg transform hover:scale-105"
          >
            <FiHome className="text-lg" />
            Ir al Inicio
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 text-primary-900 font-medium rounded-lg transition-all duration-300 hover:bg-neutral-300"
          >
            <FiArrowLeft className="text-lg" />
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
