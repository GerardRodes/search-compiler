import { _ as _objectSpread2, L as Logical_Operator, C as Comparison_Operator, T as Text_Type } from './Tokenizer-2913129a.js';

var Filter_Operator_Type = _objectSpread2({}, Logical_Operator);
var Condition_Operator_Part_Type = _objectSpread2({}, Comparison_Operator, {}, Logical_Operator);
var Condition_Text_Part_Type = _objectSpread2({}, Text_Type);
var Condition_Type;

(function (Condition_Type) {
  Condition_Type["Filter"] = "filter";
  Condition_Type["Condition"] = "condition";
})(Condition_Type || (Condition_Type = {}));

var Node_Type = _objectSpread2({}, Filter_Operator_Type, {}, Condition_Type, {}, Condition_Text_Part_Type, {}, Condition_Operator_Part_Type);
var filter_operator_token_types = new Set(Object.values(Filter_Operator_Type));
var condition_operator_part_token_types = new Set(Object.values(Condition_Operator_Part_Type));
var condition_text_part_token_types = new Set(Object.values(Condition_Text_Part_Type));

function NewSyntaxErr(msg, explanation) {
  var explanation_msg = Object.entries(explanation).map((_ref) => {
    var [key, val] = _ref;
    return key + ': ' + val;
  }).join('\n');
  return new SyntaxError(msg + '\n' + explanation_msg);
}

function NewUnexpectedTokenErr(scope, part, explanation) {
  return NewSyntaxErr("Unexpected token interpreting ".concat(scope, "'s ").concat(part), explanation);
}

function Syntaxer(tokens) {
  var current = 0;

  function Interpreter_Factory(types, type, from) {
    return function () {
      var words = [];

      if (current >= tokens.length) {
        throw new SyntaxError("Unexpected end reached, expected to find the ".concat(from, "'s ").concat(type, ".\nValid types: ") + Array.from(types.values()).join(', '));
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

  var interpret_filter_operator = Interpreter_Factory(filter_operator_token_types, 'operator', 'filter');
  var interpret_condition_attribute = Interpreter_Factory(condition_text_part_token_types, 'attribute', 'condition');
  var interpret_condition_operator = Interpreter_Factory(condition_operator_part_token_types, 'operator', 'condition');
  var interpret_condition_value = Interpreter_Factory(condition_text_part_token_types, 'value', 'condition');

  function interpret_condition() {
    var attribute = interpret_condition_attribute();
    var operator = interpret_condition_operator();
    var value = interpret_condition_value();
    return {
      type: Condition_Type.Condition,
      attribute,
      operator,
      value
    };
  }

  function interpret_filter(operator, conditions) {
    var filter = {
      type: Condition_Type.Filter,
      operator,
      conditions
    };

    while (current < tokens.length) {
      filter.conditions.push(interpret_condition());
      if (current === tokens.length) break;
      var next_operators = interpret_filter_operator();

      if (current === tokens.length) {
        throw NewSyntaxErr('A filter operator can\'t be the end of a filter', {
          'found operator': next_operators[0].value
        });
      }

      if (next_operators.length !== 1) {
        throw NewUnexpectedTokenErr('filter', 'operator', {
          expected: '1 operator',
          found: "".concat(next_operators.length, " operators"),
          'with values': next_operators.map(o => o.value).join(', ')
        });
      }

      var next_operator_type = next_operators[0].type;
      if (next_operator_type === operator) continue;

      if (next_operator_type === Filter_Operator_Type.And) {
        filter.conditions.push(interpret_filter(next_operator_type, [filter.conditions.pop()]));
      } else {
        return filter;
      }
    }

    return filter;
  }

  return {
    filter: interpret_filter(Filter_Operator_Type.Or, [])
  };
}

export default Syntaxer;
export { Condition_Operator_Part_Type, Condition_Text_Part_Type, Condition_Type, Filter_Operator_Type, Node_Type };
