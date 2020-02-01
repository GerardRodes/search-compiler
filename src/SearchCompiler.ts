import Tokenizer from './Tokenizer'
import Syntaxer from './Syntaxer'
import Semantiker from './Semantiker'
import JSONFilter from './outputs/JSONFilter'

export default function SearchCompiler (input: string): string {
  const tokens = Tokenizer(input)
  const syntaxTree = Syntaxer(tokens)
  const semanticTree = Semantiker(syntaxTree)
  return JSONFilter(semanticTree)
}
