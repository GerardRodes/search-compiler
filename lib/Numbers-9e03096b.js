function parse_number(value) {
  var number = '';

  for (var char of value) {
    if (char === '_' || char === ',') continue;
    number += char;
  }

  return parseFloat(number);
}

export { parse_number as p };
