/**
 * Component Verification Script
 * Compares componentSchemas with ComponentRenderer registry
 */

// Import the schemas and renderer registry
const { componentSchemas } = require('./src/schemas/componentSchemas.ts');
const { getRegisteredTypes } = require('./src/components/ComponentRenderer.tsx');

console.log('🔍 Verifying Component Registry...\n');

// Get all schema keys
const schemaKeys = Object.keys(componentSchemas);
console.log(`📋 Components in schemas: ${schemaKeys.length}`);
console.log('Schema components:', schemaKeys.sort());

// Get all registered renderer types
const rendererTypes = getRegisteredTypes();
console.log(`\n🎨 Components in renderer: ${rendererTypes.length}`);
console.log('Renderer components:', rendererTypes.sort());

// Find missing renderers (have schema but no renderer)
const missingRenderers = schemaKeys.filter(key => !rendererTypes.includes(key));
console.log(`\n❌ Missing Renderers (${missingRenderers.length}):`);
missingRenderers.forEach(key => console.log(`  - ${key}`));

// Find missing schemas (have renderer but no schema)
const missingSchemas = rendererTypes.filter(key => !schemaKeys.includes(key));
console.log(`\n❌ Missing Schemas (${missingSchemas.length}):`);
missingSchemas.forEach(key => console.log(`  - ${key}`));

// Find matches
const matches = schemaKeys.filter(key => rendererTypes.includes(key));
console.log(`\n✅ Matched Components (${matches.length}):`);
matches.forEach(key => console.log(`  - ${key}`));

console.log('\n📊 Summary:');
console.log(`  Total schemas: ${schemaKeys.length}`);
console.log(`  Total renderers: ${rendererTypes.length}`);
console.log(`  Matched: ${matches.length}`);
console.log(`  Missing renderers: ${missingRenderers.length}`);
console.log(`  Missing schemas: ${missingSchemas.length}`);
