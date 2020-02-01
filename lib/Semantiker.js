import { Comparison_Operator } from './Tokenizer.js';

function Semantiker(syntax_tree) {
    return {
        filter: walk_tree(syntax_tree.filter)
    };
}
function walk_tree(syntax_node) {
    if (syntax_node.type === 'filter') {
        return {
            type: 'filter',
            operator: syntax_node.operator,
            conditions: syntax_node.conditions.map(walk_tree)
        };
    }
    if (syntax_node.type !== 'condition')
        throw new TypeError(`[Semantiker] Expected condition node but found ${syntax_node.type}`);
    return {
        type: 'condition',
        attribute: generate_attribute(syntax_node.attribute),
        operator: generate_operator(syntax_node.operator),
        value: generate_value(syntax_node.value)
    };
}
function generate_attribute(parts) {
    return parts.map(part => part.value.toLowerCase()).join('_');
}
function generate_operator(parts) {
    if (parts.length === 1) {
        return parts[0].type;
    }
    const values = new Set(parts.map(part => part.type));
    if (values.size === 1)
        return values.values().next().value;
    if (values.size === 2 && values.has(Comparison_Operator.Not)) {
        values.delete(Comparison_Operator.Not);
        const operator = values.values().next().value;
        switch (operator) {
            case Comparison_Operator.Equal:
                return Comparison_Operator.Not_equal;
            case Comparison_Operator.Includes:
                return Comparison_Operator.Not_includes;
            default:
                throw new Error(`[Semantiker] Operator "${operator}" cannot be negated`);
        }
    }
    return Comparison_Operator.Equal;
}
function generate_value(parts) {
    return parts.map(part => part.value).join(' ');
}

export default Semantiker;
