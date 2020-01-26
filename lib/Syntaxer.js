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
    ...Condition_Type,
    ...Condition_Text_Part_Type,
    ...Filter_Operator_Type,
    ...Condition_Operator_Part_Type
};
const condition_operator_part_token_types = new Set(Object.values(Condition_Operator_Part_Type));
const condition_text_part_token_types = new Set(Object.values(Condition_Text_Part_Type));
function Syntaxer(tokens) {
    let current = 0;
    function Interpreter_Factory(types, type) {
        return function (tokens) {
            const words = [];
            if (!types.has(tokens[current].type)) {
                throw new SyntaxError(`Unexpected token interpreting condition's ${type}
expected: ${Array.from(types.values()).map(type => `"${type}"`).join(', ')}
got: ${tokens[current].type}
with value: ${tokens[current].value}`);
            }
            while (current < tokens.length && types.has(tokens[current].type)) {
                words.push(tokens[current]);
                current++;
            }
            return words;
        };
    }
    const interpret_attribute = Interpreter_Factory(condition_text_part_token_types, 'attribute');
    const interpret_operator = Interpreter_Factory(condition_operator_part_token_types, 'operator');
    const interpret_value = Interpreter_Factory(condition_text_part_token_types, 'value');
    function interpret_condition() {
        const attribute = interpret_attribute(tokens);
        const operator = interpret_operator(tokens);
        const value = interpret_value(tokens);
        return { type: Condition_Type.Condition, attribute, operator, value };
    }
    const filter = {
        type: Condition_Type.Filter,
        operator: Filter_Operator_Type.And,
        conditions: [interpret_condition()]
    };
    return filter;
}

export default Syntaxer;
export { Condition_Operator_Part_Type, Condition_Text_Part_Type, Condition_Type, Filter_Operator_Type, Node_Type };
