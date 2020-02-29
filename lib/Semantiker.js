import Field_Store from './Field_Store.js';
import './Tokenizer-2913129a.js';
import { Condition_Operator_Part_Type } from './Syntaxer.js';

function Semantiker(syntax_tree) {
  var field_store = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Field_Store();
  return {
    filter: walk_tree(syntax_tree.filter, field_store)
  };
}

function walk_tree(syntax_node, field_store) {
  var _field$measurement;

  if (syntax_node.type === 'filter') {
    return {
      type: 'filter',
      operator: syntax_node.operator,
      conditions: syntax_node.conditions.map(condition => walk_tree(condition, field_store))
    };
  }

  if (syntax_node.type !== 'condition') throw new TypeError("[Semantiker] Expected condition node but found ".concat(syntax_node.type));
  var field = field_store.find(syntax_node.attribute);
  var value_parts = syntax_node.value.map(part => part.value);
  var attr_parts = syntax_node.attribute.map(part => part.value);
  var parsed_value = field === null || field === void 0 ? void 0 : (_field$measurement = field.measurement) === null || _field$measurement === void 0 ? void 0 : _field$measurement.parse(syntax_node.value);
  return {
    type: 'condition',
    attribute: {
      parts: attr_parts,
      value: field != null ? field.attribute : attr_parts.map(part => part.toLowerCase()).join('_')
    },
    operator: generate_operator(syntax_node.operator),
    value: parsed_value == null ? {
      type: 'raw',
      parts: value_parts,
      value: value_parts.join(' ')
    } : {
      type: field.measurement.name,
      parts: value_parts,
      value: parsed_value
    }
  };
}

function generate_operator(parts) {
  var values = new Set(parts.map(part => part.type));

  if (values.has(Condition_Operator_Part_Type.Not_equal)) {
    values.delete(Condition_Operator_Part_Type.Not_equal);
    values.add(Condition_Operator_Part_Type.Not);
    values.add(Condition_Operator_Part_Type.Equal);
  } else if (values.has(Condition_Operator_Part_Type.Not_includes)) {
    values.delete(Condition_Operator_Part_Type.Not_includes);
    values.add(Condition_Operator_Part_Type.Not);
    values.add(Condition_Operator_Part_Type.Includes);
  }

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
