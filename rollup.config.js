import typescript from 'rollup-plugin-typescript2'
import { eslint } from 'rollup-plugin-eslint'

export default {
  input: [
    'src/SearchCompiler.ts',
    'src/Syntaxer.ts',
    'src/Tokenizer.ts'
  ],
  output: {
    dir: 'lib',
    format: 'esm'
  },
  plugins: [
    eslint(),
    typescript()
  ]
}
