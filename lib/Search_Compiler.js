import { b as Tokenizer } from './Tokenizer-2913129a.js';
import Syntaxer from './Syntaxer.js';
import Field_Store from './Field_Store.js';
import Semantiker from './Semantiker.js';
import JSON_Filter from './JSON_Filter.js';

function Search_Compiler(input) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var field_store = new Field_Store(fields);
  var tokens = Tokenizer(input);
  var syntax_tree = Syntaxer(tokens);
  var semantic_tree = Semantiker(syntax_tree, field_store);
  return JSON_Filter();
}

export default Search_Compiler;
