import Tokenizer from './Tokenizer.js';
import Syntaxer from './Syntaxer.js';
import './Semantiker.js';
import JSONFilter from './JSONFilter.js';

function SearchCompiler(input) {
    const tokens = Tokenizer(input);
    const syntaxTree = Syntaxer(tokens);
    return JSONFilter();
}

export default SearchCompiler;
