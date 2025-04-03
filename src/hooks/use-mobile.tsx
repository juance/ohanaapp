
import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para verificar si es un dispositivo móvil
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Verificamos inmediatamente
    checkIsMobile();

    // Agregamos listener para cambios de tamaño
    window.addEventListener('resize', checkIsMobile);

    // Limpiamos el listener cuando se desmonte el componente
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};
