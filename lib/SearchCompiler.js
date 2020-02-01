import Tokenizer from './Tokenizer.js';
import Syntaxer from './Syntaxer.js';
import Semantiker from './Semantiker.js';
import JSONFilter from './JSONFilter.js';

function SearchCompiler(input) {
    const tokens = Tokenizer(input);
    const syntaxTree = Syntaxer(tokens);
    const semanticTree = Semantiker(syntaxTree);
    return JSONFilter();
}

export default SearchCompiler;
