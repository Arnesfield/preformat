import eslint from '@rollup/plugin-eslint';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json' assert { type: 'json' };

const input = 'src/index.ts';
// skip sourcemap and umd unless production
const WATCH = process.env.ROLLUP_WATCH === 'true';

function dev(options) {
  return { input, external: ['util'], watch: { skipWrite: true }, ...options };
}

const configs = [
  {
    input,
    output: { file: pkg.types, format: 'esm' },
    plugins: [bundleSize(), dts()]
  },
  // lint and type checking
  dev({ plugins: [eslint(), esbuild()], include: WATCH }),
  dev({ plugins: [typescript()], include: WATCH })
];

export default configs.filter(config => {
  const { include } = config;
  delete config.include;
  return typeof include !== 'boolean' || include;
});
