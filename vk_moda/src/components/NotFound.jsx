
import { Link } from 'react-router-dom'; // Asumiendo que estás utilizando React Router

// Reemplaza con la ruta correcta de tu imagen

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img  alt="Página no encontrada" className="w-80 h-auto mb-4" />
      <h1 className="text-2xl font-semibold mb-2">¡Oops! Página no encontrada</h1>
      <p className="text-gray-600 mb-4">La página que estás buscando no existe.</p>
      <Link to="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
    </div>
  );
}

export default NotFound;