
# Testing Setup - Fase 2: Estructura Completa

Este directorio contiene la configuración y estructura completa para las pruebas unitarias de la aplicación.

## Estructura de Directorios

```
src/__tests__/
├── utils/
│   └── test-utils.tsx           # Utilidades personalizadas para testing
├── mocks/
│   ├── supabase.ts             # Mocks para Supabase
│   └── localStorage.ts         # Mocks para localStorage
├── lib/
│   ├── services/               # Tests para servicios de negocio
│   │   └── ticketService.test.ts
│   ├── data/                   # Tests para servicios de datos
│   │   └── customer/
│   │       └── customerService.test.ts
│   └── utils/                  # Tests para utilidades
├── hooks/                      # Tests para custom hooks
│   └── useAuth.test.tsx
├── components/                 # Tests para componentes React
│   ├── ui/                     # Tests para componentes UI
│   │   └── button.test.tsx
│   └── business/               # Tests para componentes de negocio
├── utils/                      # Tests para utilidades globales
│   ├── dateUtils.test.ts
│   └── priceUtils.test.ts
├── App.test.tsx               # Test principal de la aplicación
└── README.md                  # Esta documentación
```

## Scripts de Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas específicas
npm test -- button.test.tsx

# Ejecutar pruebas por patrón
npm test -- --testPathPattern=components

# Ejecutar tests de servicios específicos
npm test -- --testPathPattern=services
```

## Convenciones de Naming

1. **Archivos de test**: `*.test.tsx` para componentes, `*.test.ts` para lógica
2. **Describe blocks**: Usar el nombre del componente/función que se está probando
3. **Test names**: Describir claramente el comportamiento esperado
4. **Setup**: Usar `beforeEach` para configuración común

## Categorías de Testing

### ✅ Completadas
- [x] Configuración básica de Jest
- [x] Utilities de testing
- [x] Mocks básicos
- [x] Estructura de directorios

### 🔄 En Progreso
- [ ] Tests de servicios de datos
- [ ] Tests de hooks personalizados
- [ ] Tests de componentes UI
- [ ] Tests de utilidades

### 📋 Pendientes
- [ ] Tests de componentes de negocio
- [ ] Tests de contextos
- [ ] Tests de integración
- [ ] Configuración de CI/CD

## Próximos Pasos

La Fase 2 está lista. Ahora puedes:

1. **Implementar tests específicos**: Comenzar con una categoría específica
2. **Continuar con Fase 3**: Implementar pruebas por categorías completas
3. **Enfoque selectivo**: Elegir componentes/servicios específicos para probar

## Herramientas Disponibles

- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **@testing-library/jest-dom**: Matchers adicionales
- **ts-jest**: Soporte para TypeScript
- **Mocks**: Supabase, localStorage, y más

```

Ahora voy a crear un archivo de configuración para scripts de testing:

<lov-write file_path="src/__tests__/scripts/test-categories.js">
// Script para ejecutar tests por categorías
const { execSync } = require('child_process');

const categories = {
  services: 'src/__tests__/lib/services/',
  hooks: 'src/__tests__/hooks/',
  components: 'src/__tests__/components/',
  utils: 'src/__tests__/utils/',
  ui: 'src/__tests__/components/ui/',
  business: 'src/__tests__/components/business/'
};

const category = process.argv[2];

if (!category || !categories[category]) {
  console.log('Categorías disponibles:');
  Object.keys(categories).forEach(cat => {
    console.log(`  - ${cat}`);
  });
  process.exit(1);
}

try {
  execSync(`npm test -- --testPathPattern=${categories[category]}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error ejecutando tests:', error.message);
  process.exit(1);
}
