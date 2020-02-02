import typescript from 'rollup-plugin-typescript2'
import { eslint } from 'rollup-plugin-eslint'
import babel from 'rollup-plugin-babel'

export default {
  input: [
    'src/Search_Compiler.ts',
    'src/Syntaxer.ts',
    'src/Tokenizer.ts',
    'src/Semantiker.ts',
    'src/Field_Store.ts',
    'src/outputs/JSON_Filter.ts',
    'src/measurements/Time.ts',
    'src/measurements/Measurement.ts',
    'src/measurements/Data_Storage.ts',
    'src/measurements/Data_Transmision.ts'
  ],
  output: {
    dir: 'lib',
    format: 'esm'
  },
  plugins: [
    eslint(),
    typescript(),
    babel({
      extensions: ['ts']
    })
  ]
}
