
#!/usr/bin/env node

const { execSync } = require('child_process');

const testCategories = {
  unit: 'src/__tests__/lib/**/*.test.{ts,tsx}',
  components: 'src/__tests__/components/**/*.test.{ts,tsx}',
  hooks: 'src/__tests__/hooks/**/*.test.{ts,tsx}',
  utils: 'src/__tests__/utils/**/*.test.{ts,tsx}',
  integration: 'src/tests/**/*.test.{ts,tsx}',
  all: 'src/**/*.test.{ts,tsx}'
};

const category = process.argv[2] || 'all';

if (!testCategories[category]) {
  console.error(`Categoría de test no válida: ${category}`);
  console.error(`Categorías disponibles: ${Object.keys(testCategories).join(', ')}`);
  process.exit(1);
}

const testPattern = testCategories[category];

console.log(`🧪 Ejecutando tests para categoría: ${category}`);
console.log(`📁 Patrón: ${testPattern}`);

try {
  execSync(`jest ${testPattern} --verbose`, { stdio: 'inherit' });
  console.log(`✅ Tests completados para categoría: ${category}`);
} catch (error) {
  console.error(`❌ Error ejecutando tests para categoría: ${category}`);
  process.exit(1);
}
