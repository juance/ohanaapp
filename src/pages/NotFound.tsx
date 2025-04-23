
import { useEffect } from "react";

const NotFound = () => {
  // No intentamos usar useLocation ya que puede fallar si se renderiza fuera del contexto del Router
  const pathname = window.location.pathname || "ruta-desconocida";

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
