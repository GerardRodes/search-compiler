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
function NewSyntaxError(scope, part, explanation) {
    const msg = `Unexpected token interpreting ${scope}'s ${part}`;
    const explanation_msg = Object.entries(explanation).map(([key, val]) => key + ': ' + val).join('\n');
    return new SyntaxError(msg + '\n' + explanation_msg);
}
function Syntaxer(tokens) {
    let current = 0;
    function Interpreter_Factory(types, type, from) {
        return function () {
            const words = [];
            if (!types.has(tokens[current].type)) {
                throw NewSyntaxError(from, type, {
                    expected: Array.from(types.values()).map(type => `"${type}"`).join(', '),
                    got: tokens[current].type,
                    'with value': tokens[current].value
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
    function interpret_filter(operator, conditions, is_root) {
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
            if (next_operators.length !== 1) {
                throw NewSyntaxError('filter', 'operator', {
                    expected: '1 operator',
                    found: `${next_operators.length} operators`,
                    'with values': next_operators.map(o => o.value).join(', ')
                });
            }
            if (next_operators[0].type === operator)
                continue;
            const child_filter = interpret_filter(next_operators[0].type, filter.conditions.slice(), false);
            if (is_root) {
                filter.operator = child_filter.operator;
            }
            filter.conditions = child_filter.conditions;
        }
        return filter;
    }
    return interpret_filter(Filter_Operator_Type.And, [], true);
}

export default Syntaxer;
export { Condition_Operator_Part_Type, Condition_Text_Part_Type, Condition_Type, Filter_Operator_Type, Node_Type };
