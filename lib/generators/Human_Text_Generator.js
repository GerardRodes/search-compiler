import '../Tokenizer-2913129a.js';
import { Condition_Operator_Part_Type } from '../Syntaxer.js';

function Human_Text_Generator(semantic_tree, field_store) {
  return walk_tree(semantic_tree.filter, field_store);
}

function walk_tree(node, field_store) {
  if (node.type === 'filter') {
    return node.conditions.map(c => walk_tree(c, field_store)).join(' ' + node.operator + ' ');
  }

  var attr = node.attribute.value in field_store.by_attr ? field_store.by_attr[node.attribute.value].name : node.attribute.parts.join(' ');
  var operator = operator_2_text(node.operator);
  var value = node.value.parts.join(' ');
  var parts = [attr, operator, value];

  if (node.operator.type === Condition_Operator_Part_Type.Includes) {
    parts.reverse();
  }

  return parts.join(' ');
}

var THAN = new Set(['greater', 'lower']);
var TO = new Set(['equal', 'greater_or_equal', 'lower_or_equal']);

function operator_2_text(operator) {
  var text = operator.type.replace(/_/g, ' ');

  if (operator.negated) {
    if (operator.type === Condition_Operator_Part_Type.Includes) {
      text = 'does not ' + text.slice(0, -1);
    } else {
      text = 'not ' + text;
    }
  }

  if (THAN.has(operator.type)) {
    return "is ".concat(text, " than");
  }

  if (TO.has(operator.type)) {
    return "is ".concat(text, " to");
  }

  return text;
}

export default Human_Text_Generator;
