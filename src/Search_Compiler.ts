import Tokenizer from './Tokenizer'
import Syntaxer from './Syntaxer'
import Semantiker, { Semantic_Tree } from './Semantiker'
import Field_Store, { Field_Definition } from './Field_Store'

export default function Search_Compiler (
  input: string,
  generator: (sematic_tree: Semantic_Tree, field_store: Field_Store) => any,
  fields: Field_Definition[] = []
): any {
  const field_store = new Field_Store(fields)

  const tokens = Tokenizer(input)
  const syntax_tree = Syntaxer(tokens)
  const semantic_tree = Semantiker(syntax_tree, field_store)

  return generator(semantic_tree, field_store)
}
