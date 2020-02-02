function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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

var Token_Type = _objectSpread2({}, Comparison_Operator, {}, Logical_Operator, {}, Text_Type);
function Tokenizer(input) {
  var tokens = [];
  var current = 0;

  function skip_break() {
    while (current < input.length && is_break(input[current])) {
      current++;
    }
  }

  function Read_Factory(checker) {
    return function () {
      var value = '';

      while (current < input.length && checker(input[current])) {
        value += input[current];
        current++;
      }

      return value;
    };
  }

  var read_number = Read_Factory(is_number);
  var read_remaining = Read_Factory(is_remaining);
  var read_operator = Read_Factory(is_operator);

  function next_token() {
    var token = {
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
          throw new TypeError("Unknown operator \"".concat(token.value, "\""));
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
    if (is_break(input[current])) break;
    tokens.push(next_token());
  }

  return tokens;
}
var breaks = new Set([' ', '\n', '\r', '\t', undefined]);

function is_break(char) {
  return breaks.has(char);
}

var numbers = new Set(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '_']);

function is_number(char) {
  return numbers.has(char);
}

var operators = new Set(['=', '!', '|', '&', '>', '<']);

function is_operator(char) {
  return operators.has(char);
}

function is_remaining(char) {
  return !(is_break(char) || is_operator(char));
}

export { Comparison_Operator as C, Logical_Operator as L, Text_Type as T, _objectSpread2 as _, Token_Type as a, Tokenizer as b };
