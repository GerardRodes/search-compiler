export function parse_number (value: string): number {
  let number = ''

  for (const char of value) {
    if (char === '_' || char === ',') continue
    number += char
  }

  return parseFloat(number)
}
