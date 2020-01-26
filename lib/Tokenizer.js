var Comparison_Operator;
(function (Comparison_Operator) {
    Comparison_Operator["Includes"] = "includes";
    Comparison_Operator["Equal"] = "equal";
    Comparison_Operator["Not_equal"] = "not_equal";
    Comparison_Operator["Greater"] = "greater";
    Comparison_Operator["Greater_or_equal"] = "greater_or_equal";
    Comparison_Operator["Lower"] = "lower";
    Comparison_Operator["Lower_or_equal"] = "lower_or_equal";
    Comparison_Operator["Not"] = "not";
})(Comparison_Operator || (Comparison_Operator = {}));
var Logical_Operator;
(function (Logical_Operator) {
    Logical_Operator["Or"] = "or";
    Logical_Operator["And"] = "and";
})(Logical_Operator || (Logical_Operator = {}));
var Text_Type;
(function (Text_Type) {
    Text_Type["Word"] = "word";
    Text_Type["Number"] = "number";
})(Text_Type || (Text_Type = {}));
const Token_Type = {
    ...Comparison_Operator,
    ...Logical_Operator,
    ...Text_Type
};
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
    const read_operator = Read_Factory(is_operator);
    function next_token() {
        const token = {
            value: '',
            type: Token_Type.Word
        };
        if (is_number(input[current])) {
            token.value = read_number();
            token.type = Token_Type.Number;
            return token;
        }
        if (is_alpha(input[current])) {
            token.value = read_word();
            switch (token.value) {
                case 'is':
                case 'equal':
                    token.type = Token_Type.Equal;
                    break;
                case 'includes':
                case 'contains':
                case 'has':
                case 'in':
                    token.type = Token_Type.Includes;
                    break;
                case 'or':
                    token.type = Token_Type.Or;
                    break;
                case 'and':
                    token.type = Token_Type.And;
                    break;
                case 'not':
                    token.type = Token_Type.Not;
                    break;
                default:
                    token.type = Token_Type.Word;
                    break;
            }
            return token;
        }
        token.value = read_operator();
        switch (token.value) {
            case '=':
            case '==':
                token.type = Token_Type.Equal;
                break;
            case '!=':
                token.type = Token_Type.Not_equal;
                break;
            case '||':
                token.type = Token_Type.Or;
                break;
            case '&&':
                token.type = Token_Type.And;
                break;
            case '!':
                token.type = Token_Type.Not;
                break;
            case '>':
                token.type = Token_Type.Greater;
                break;
            case '<':
                token.type = Token_Type.Lower;
                break;
            case '>=':
                token.type = Token_Type.Greater_or_equal;
                break;
            case '<=':
                token.type = Token_Type.Lower_or_equal;
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
const breaks = new Set([' ', '\n', '\r', '\t', undefined]);
function is_break(char) {
    return breaks.has(char);
}
function is_number(char) {
    return (char >= '0' && char <= '9') || char === '.' || char === ',' || char === '_';
}
function is_alpha(char) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
}
const operators = new Set(['=', '!', '|', '&', '>', '<']);
function is_operator(char) {
    return operators.has(char);
}

export default Tokenizer;
export { Comparison_Operator, Logical_Operator, Text_Type, Token_Type };
