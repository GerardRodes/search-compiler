import Tokenizer from './Tokenizer'
import Syntaxer from './Syntaxer'
import Semantiker from './Semantiker'
import JSON_Filter from './outputs/JSON_Filter'
import Field_Store, { Field_Definition } from './Field_Store'

export default function Search_Compiler (input: string, fields: Field_Definition[]): string {
  const field_store = new Field_Store(fields)

  const tokens = Tokenizer(input)
  const syntax_tree = Syntaxer(tokens)
  const semantic_tree = Semantiker(syntax_tree, field_store)

  return JSON_Filter(semantic_tree)
}
