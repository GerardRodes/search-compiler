import { Logical_Operator, Comparison_Operator, Text_Type } from './Tokenizer.js';

const Filter_Operator_Type = { ...Logical_Operator };
const Condition_Operator_Part_Type = { ...Comparison_Operator };
const Condition_Text_Part_Type = { ...Text_Type };
var Condition_Type;
(function (Condition_Type) {
    Condition_Type["Filter"] = "filter";
    Condition_Type["Condition"] = "condition";
})(Condition_Type || (Condition_Type = {}));
const Node_Type = {
    ...Filter_Operator_Type,
    ...Condition_Type,
    ...Condition_Text_Part_Type,
    ...Condition_Operator_Part_Type
};
const filter_operator_token_types = new Set(Object.values(Filter_Operator_Type));
const condition_operator_part_token_types = new Set(Object.values(Condition_Operator_Part_Type));
const condition_text_part_token_types = new Set(Object.values(Condition_Text_Part_Type));
function NewSyntaxErr(msg, explanation) {
    const explanation_msg = Object.entries(explanation).map(([key, val]) => key + ': ' + val).join('\n');
    return new SyntaxError(msg + '\n' + explanation_msg);
}
function NewUnexpectedTokenErr(scope, part, explanation) {
    return NewSyntaxErr(`Unexpected token interpreting ${scope}'s ${part}`, explanation);
}
function Syntaxer(tokens) {
    let current = 0;
    function Interpreter_Factory(types, type, from) {
        return function () {
            const words = [];
            if (current >= tokens.length) {
                throw new SyntaxError(`Unexpected end reached, expected to find the ${from}'s ${type}.
Valid types: ` + Array.from(types.values()).join(', '));
            }
            if (!types.has(tokens[current].type)) {
                throw NewUnexpectedTokenErr(from, type, {
                    expected: Array.from(types.values()).join(', '),
                    got: tokens[current].type,
                    'with value': '"' + tokens[current].value + '"'
                });
            }
            while (current < tokens.length && types.has(tokens[current].type)) {
                words.push(tokens[current]);
                current++;
            }
            return words;
        };
    }
    const interpret_filter_operator = Interpreter_Factory(filter_operator_token_types, 'operator', 'filter');
    const interpret_condition_attribute = Interpreter_Factory(condition_text_part_token_types, 'attribute', 'condition');
    const interpret_condition_operator = Interpreter_Factory(condition_operator_part_token_types, 'operator', 'condition');
    const interpret_condition_value = Interpreter_Factory(condition_text_part_token_types, 'value', 'condition');
    function interpret_condition() {
        const attribute = interpret_condition_attribute();
        const operator = interpret_condition_operator();
        const value = interpret_condition_value();
        return { type: Condition_Type.Condition, attribute, operator, value };
    }
    function interpret_filter(operator, conditions) {
        const filter = {
            type: Condition_Type.Filter,
            operator,
            conditions
        };
        while (current < tokens.length) {
            filter.conditions.push(interpret_condition());
            if (current === tokens.length)
                break;
            const next_operators = interpret_filter_operator();
            if (current === tokens.length) {
                throw NewSyntaxErr('A filter operator can\'t be the end of a filter', {
                    'found operator': next_operators[0].value
                });
            }
            if (next_operators.length !== 1) {
                throw NewUnexpectedTokenErr('filter', 'operator', {
                    expected: '1 operator',
                    found: `${next_operators.length} operators`,
                    'with values': next_operators.map(o => o.value).join(', ')
                });
            }
            const next_operator_type = next_operators[0].type;
            if (next_operator_type === operator)
                continue;
            if (next_operator_type === Filter_Operator_Type.And) {
                filter.conditions.push(interpret_filter(next_operator_type, [filter.conditions.pop()]));
            }
            else {
                return filter;
            }
        }
        return filter;
    }
    return interpret_filter(Filter_Operator_Type.Or, []);
}

export default Syntaxer;
export { Condition_Operator_Part_Type, Condition_Text_Part_Type, Condition_Type, Filter_Operator_Type, Node_Type };
