var Comparison_Operator;
(function (Comparison_Operator) {
    Comparison_Operator["Includes"] = "includes";
    Comparison_Operator["Not_includes"] = "not_includes";
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
    Text_Type["Remaining"] = "remaining";
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
        while (current < input.length && is_break(input[current])) {
            current++;
        }
    }
    function Read_Factory(checker) {
        return function () {
            let value = '';
            while (current < input.length && checker(input[current])) {
                value += input[current];
                current++;
            }
            return value;
        };
    }
    const read_number = Read_Factory(is_number);
    const read_remaining = Read_Factory(is_remaining);
    const read_operator = Read_Factory(is_operator);
    function next_token() {
        const token = {
            value: '',
            type: Token_Type.Remaining
        };
        if (is_number(input[current])) {
            token.value = read_number();
            token.type = Token_Type.Number;
            return token;
        }
        if (is_operator(input[current])) {
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
        token.value = read_remaining();
        switch (token.value.toLowerCase()) {
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
            case 'greater':
            case 'more':
            case 'above':
                token.type = Token_Type.Greater;
                break;
            case 'lower':
            case 'less':
            case 'below':
                token.type = Token_Type.Lower;
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
                token.type = Token_Type.Remaining;
                break;
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
const numbers = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '_']);
function is_number(char) {
    return numbers.has(char);
}
const operators = new Set(['=', '!', '|', '&', '>', '<']);
function is_operator(char) {
    return operators.has(char);
}
function is_remaining(char) {
    return !(is_break(char) || is_operator(char));
}

export default Tokenizer;
export { Comparison_Operator, Logical_Operator, Text_Type, Token_Type };
