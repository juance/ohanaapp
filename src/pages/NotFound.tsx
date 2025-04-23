
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  // Intentamos usar useLocation, pero lo envolvemos en un try/catch para evitar errores
  let pathname = "ruta-desconocida";
  try {
    const location = useLocation();
    pathname = location.pathname;
  } catch (error) {
    console.error("Error accediendo a la ubicación:", error);
  }

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Página no encontrada</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
