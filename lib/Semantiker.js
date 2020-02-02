import './Tokenizer-2913129a.js';
import { Condition_Operator_Part_Type } from './Syntaxer.js';

function Semantiker(syntax_tree, field_store) {
  return {
    filter: walk_tree(syntax_tree.filter, field_store)
  };
}

function walk_tree(syntax_node, field_store) {
  var _field$measurement$pa;

  if (syntax_node.type === 'filter') {
    return {
      type: 'filter',
      operator: syntax_node.operator,
      conditions: syntax_node.conditions.map(condition => walk_tree(condition, field_store))
    };
  }

  if (syntax_node.type !== 'condition') throw new TypeError("[Semantiker] Expected condition node but found ".concat(syntax_node.type));
  var field = field_store.find(syntax_node.attribute);
  return {
    type: 'condition',
    attribute: field != null ? field.attribute : generate_attribute(syntax_node.attribute),
    operator: generate_operator(syntax_node.operator),
    value: (field === null || field === void 0 ? void 0 : field.measurement) != null ? (_field$measurement$pa = field.measurement.parse(syntax_node.value)) !== null && _field$measurement$pa !== void 0 ? _field$measurement$pa : generate_value(syntax_node.value) : generate_value(syntax_node.value)
  };
}

function generate_attribute(parts) {
  return parts.map(part => part.value.toLowerCase()).join('_');
}

function generate_value(parts) {
  return parts.map(part => part.value).join(' ');
}

function generate_operator(parts) {
  if (parts.length === 1) {
    return {
      type: parts[0].type,
      negated: false
    };
  }

  var values = new Set(parts.map(part => part.type));
  var negated = values.has(Condition_Operator_Part_Type.Not);

  if (negated) {
    values.delete(Condition_Operator_Part_Type.Not);
  }

  var type = Condition_Operator_Part_Type.Equal;
  values.delete(Condition_Operator_Part_Type.Equal);
  if (values.size === 0) return {
    type,
    negated
  };

  if (values.has(Condition_Operator_Part_Type.Or)) {
    if (values.has(Condition_Operator_Part_Type.Greater)) {
      return {
        type: Condition_Operator_Part_Type.Greater_or_equal,
        negated
      };
    } else if (values.has(Condition_Operator_Part_Type.Lower)) {
      return {
        type: Condition_Operator_Part_Type.Lower_or_equal,
        negated
      };
    } else {
      throw new SyntaxError('[Semantiker] A condition operator with and "or" must include also "greater" or "lower"');
    }
  }

  if (values.size !== 1) {
    throw new SyntaxError("[Semantiker] Found two incompatible operators on condition \"".concat(Array.from(values.values()).join(', '), "\""));
  }

  return {
    type: values.values().next().value,
    negated
  };
}

export default Semantiker;
