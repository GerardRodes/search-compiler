function Tokenizer(input) {
    const tokens = [];
    let current = 0;
    function skip_break() {
        while (is_break(input[current])) {
            current++;
        }
    }
    function Read_Factory(checker) {
        return function () {
            let value = '';
            while (checker(input[current])) {
                value += input[current];
                current++;
            }
            return value;
        };
    }
    const read_number = Read_Factory(is_number);
    const read_word = Read_Factory(is_alpha);
    const read_symbol = Read_Factory(char => !is_break(char));
    function next_token() {
        const token = {
            value: '',
            type: '__initial_value__'
        };
        if (is_number(input[current])) {
            token.value = read_number();
            token.type = 'number';
            return token;
        }
        if (is_alpha(input[current])) {
            token.value = read_word();
            switch (token.value) {
                case 'is':
                case 'equal':
                    token.type = 'equal';
                    break;
                case 'includes':
                case 'contains':
                case 'has':
                case 'in':
                    token.type = 'includes';
                    break;
                case 'or':
                    token.type = 'or';
                    break;
                case 'and':
                    token.type = 'and';
                    break;
                case 'not':
                    token.type = 'not';
                    break;
                default:
                    token.type = 'word';
                    break;
            }
            return token;
        }
        token.value = read_symbol();
        switch (token.value) {
            case '=':
            case '==':
                token.type = 'equal';
                break;
            case '!=':
                token.type = 'not_equal';
                break;
            case '||':
                token.type = 'or';
                break;
            case '&&':
                token.type = 'and';
                break;
            case '!':
                token.type = 'not';
                break;
            case '>':
                token.type = 'greater';
                break;
            case '<':
                token.type = 'lower';
                break;
            case '>=':
                token.type = 'greater_or_equal';
                break;
            case '<=':
                token.type = 'lower_or_equal';
                break;
            default:
                throw new TypeError(`Unknown operator "${token.value}"`);
        }
        return token;
    }
    while (current < input.length) {
        skip_break();
        if (is_break(input[current]))
            break;
        tokens.push(next_token());
    }
    return tokens;
}
function is_break(char) {
    return char === ' ' || char === '\n' || char === '\r' || char === '\t' || char === undefined;
}
function is_number(char) {
    return (char >= '0' && char <= '9') || char === '.' || char === ',' || char === '_';
}
function is_alpha(char) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}

export { Tokenizer };
