import typescript from 'rollup-plugin-typescript2'
import { eslint } from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'
import multiInput from 'rollup-plugin-multi-input'

export default {
  input: [
    'src/**/*.ts'
  ],
  output: {
    dir: 'lib',
    format: 'esm'
  },
  plugins: [
    multiInput(),
    eslint(),
    typescript(),
    babel({
      extensions: ['ts']
    })
  ]
}
