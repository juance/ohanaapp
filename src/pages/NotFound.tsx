
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  // Use try/catch to handle the case when useLocation fails
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
