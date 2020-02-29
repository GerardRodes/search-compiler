import Field_Store from './Field_Store.js';
import { b as Tokenizer } from './Tokenizer-2913129a.js';
import Syntaxer from './Syntaxer.js';
import Semantiker from './Semantiker.js';

function Search_Compiler(input, generator) {
  var fields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var field_store = new Field_Store(fields);
  var tokens = Tokenizer(input);
  var syntax_tree = Syntaxer(tokens);
  var semantic_tree = Semantiker(syntax_tree, field_store);
  return generator(semantic_tree, field_store);
}

export default Search_Compiler;
