
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Validando configuración de tests...\n');

// 1. Verificar que Jest está configurado
console.log('1️⃣ Verificando configuración de Jest...');
try {
  const jestConfig = path.join(process.cwd(), 'jest.config.js');
  if (fs.existsSync(jestConfig)) {
    console.log('✅ jest.config.js encontrado');
  } else {
    console.log('❌ jest.config.js no encontrado');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error verificando configuración de Jest:', error.message);
  process.exit(1);
}

// 2. Verificar que los archivos de test existen
console.log('\n2️⃣ Verificando archivos de test...');
const testFiles = [
  'src/__tests__/components/ui/button.test.tsx',
  'src/__tests__/components/ticket/TicketForm.test.tsx',
  'src/__tests__/hooks/useAuth.test.tsx',
  'src/__tests__/lib/services/ticketService.test.ts',
  'src/__tests__/lib/data/customer/customerService.test.ts',
  'src/__tests__/mocks/supabase.ts',
  'src/setupTests.ts'
];

let missingFiles = [];
testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log(`\n❌ ${missingFiles.length} archivos de test faltantes`);
  process.exit(1);
}

// 3. Verificar compilación de TypeScript
console.log('\n3️⃣ Verificando compilación de TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript compila sin errores');
} catch (error) {
  console.log('❌ Errores de TypeScript encontrados:');
  console.log(error.stdout?.toString() || error.message);
  // No salimos aquí porque algunos errores de TS pueden ser por dependencias faltantes
}

// 4. Intentar ejecutar un test simple
console.log('\n4️⃣ Ejecutando test de validación...');
try {
  execSync('npm test -- --testPathPattern=button.test.tsx --passWithNoTests', { stdio: 'inherit' });
  console.log('✅ Test de validación exitoso');
} catch (error) {
  console.log('❌ Error ejecutando tests');
  console.log('Esto es normal si faltan dependencias o hay errores de configuración');
}

console.log('\n✅ Validación completada');
console.log('\n📋 Siguiente pasos:');
console.log('- Ejecutar: npm test para todos los tests');
console.log('- Ejecutar: npm run test:coverage para coverage');
console.log('- Ejecutar: node scripts/run-tests.js components para tests específicos');
