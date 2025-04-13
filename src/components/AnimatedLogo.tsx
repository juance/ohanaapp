import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'md',
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Tamaños según la prop size
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };
  
  useEffect(() => {
    // Marcar como cargado después de un breve retraso para la animación inicial
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Link 
      to="/" 
      className={`flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: isLoaded ? [0, isHovered ? 2 : 0, isHovered ? -2 : 0, 0] : 0
        }}
        transition={{ 
          duration: 0.5,
          rotate: {
            duration: 0.5,
            repeat: isHovered ? 1 : 0,
            repeatType: "reverse"
          }
        }}
      >
        <motion.img
          src="/images/ohana-logo.svg"
          alt="Lavandería Ohana"
          className={`w-auto ${sizes[size]}`}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
        />
      </motion.div>
    </Link>
  );
};

export default AnimatedLogo;
