const typescript = require('rollup-plugin-typescript2');
const { resolve } = require('path');

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime'
];

const commonConfig = {
  external,
  input: 'src/index.ts'
};

module.exports = [
  // ES Module build
  {
    ...commonConfig,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            declarationMap: false
          }
        }
      })
    ]
  },
  
  // CommonJS build
  {
    ...commonConfig,
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfig: './tsconfig.json',
        tsconfigOverride: {
          compilerOptions: {
            declaration: false,
            declarationMap: false
          }
        }
      })
    ]
  },
  

];
