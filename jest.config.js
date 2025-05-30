
/** @type {import('jest').Config} */
export default {
  // Entorno de testing
  testEnvironment: "jsdom",
  
  // Configuración de transformación
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      useESM: true,
      tsconfig: {
        jsx: "react-jsx",
      },
    }],
  },
  
  // Extensiones de módulos
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  
  // Archivos de configuración
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  
  // Patrones de archivos de test
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.(test|spec).{js,jsx,ts,tsx}"
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/"
  ],
  
  // Configuración de módulos
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  
  // Coverage configuration
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}"
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Reporters
  coverageReporters: ["text", "lcov", "html"],
  
  // Configuración para ESM
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  
  // Configuración adicional para React Testing Library
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  
  // Configurar globals para Jest
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
