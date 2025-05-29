
# Testing Setup

Este directorio contiene la configuración y utilidades para las pruebas unitarias de la aplicación.

## Estructura

```
src/__tests__/
├── utils/
│   └── test-utils.tsx      # Utilidades personalizadas para testing
├── mocks/
│   ├── supabase.ts         # Mocks para Supabase
│   └── localStorage.ts     # Mocks para localStorage
├── App.test.tsx            # Ejemplo de test
└── README.md               # Esta documentación
```

## Ejecutar pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas específicas
npm test -- App.test.tsx
```

## Convenciones

1. **Archivos de test**: Usar `.test.tsx` o `.spec.tsx`
2. **Ubicación**: Los tests pueden estar junto al componente o en `__tests__`
3. **Naming**: Describir claramente qué se está probando
4. **Setup**: Usar `test-utils.tsx` para render con providers

## Próximos pasos

1. Crear tests para servicios de datos
2. Crear tests para hooks personalizados
3. Crear tests para componentes
4. Configurar CI/CD con testing automático
