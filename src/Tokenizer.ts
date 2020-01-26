export enum Comparison_Operator {
  Includes = 'includes',
  Equal = 'equal',
  Not_equal = 'not_equal',
  Greater = 'greater',
  Greater_or_equal = 'greater_or_equal',
  Lower = 'lower',
  Lower_or_equal = 'lower_or_equal',
  Not = 'not', // here for convenience
}

export enum Logical_Operator {
  Or = 'or',
  And = 'and',
}

export enum Text_Type {
  Word = 'word',
  Number = 'number',
}

export type Token_Type = Text_Type | Logical_Operator | Comparison_Operator
export const Token_Type = {
  ...Comparison_Operator,
  ...Logical_Operator,
  ...Text_Type
}

export interface Token {
  type: Token_Type
  value: string
}

export default function Tokenizer (input: string): Token[] {
  const tokens: Token[] = []

  let current = 0

  function skip_break (): void {
    while (is_break(input[current])) {
      current++
    }
  }

  function Read_Factory (checker: (string) => boolean): () => string {
    return function (): string {
      let value = ''

      while (checker(input[current])) {
        value += input[current]
        current++
      }

      return value
    }
  }

  const read_number = Read_Factory(is_number)
  const read_word = Read_Factory(is_alpha)
  const read_symbol = Read_Factory(char => !is_break(char))

  function next_token (): Token {
    const token: Token = {
      value: '',
      type: Token_Type.Word
    }

    if (is_number(input[current])) {
      token.value = read_number()
      token.type = Token_Type.Number
      return token
    }

    if (is_alpha(input[current])) {
      token.value = read_word()

      // check if is operator alias
      switch (token.value) {
        case 'is':
        case 'equal':
          token.type = Token_Type.Equal
          break

        case 'includes':
        case 'contains':
        case 'has':
        case 'in':
          token.type = Token_Type.Includes
          break

        case 'or':
          token.type = Token_Type.Or
          break

        case 'and':
          token.type = Token_Type.And
          break

        case 'not':
          token.type = Token_Type.Not
          break

        default:
          token.type = Token_Type.Word
          break
      }

      return token
    }

    // here only valid operators are allowed
    token.value = read_symbol()

    switch (token.value) {
      case '=':
      case '==':
        token.type = Token_Type.Equal
        break

      case '!=':
        token.type = Token_Type.Not_equal
        break

      case '||':
        token.type = Token_Type.Or
        break

      case '&&':
        token.type = Token_Type.And
        break

      case '!':
        token.type = Token_Type.Not
        break

      case '>':
        token.type = Token_Type.Greater
        break

      case '<':
        token.type = Token_Type.Lower
        break

      case '>=':
        token.type = Token_Type.Greater_or_equal
        break

      case '<=':
        token.type = Token_Type.Lower_or_equal
        break

      default:
        throw new TypeError(`Unknown operator "${token.value}"`)
    }

    return token
  }

  while (current < input.length) {
    skip_break()
    if (is_break(input[current])) break
    tokens.push(next_token())
  }

  return tokens
}

function is_break (char: string): boolean {
  return char === ' ' || char === '\n' || char === '\r' || char === '\t' || char === undefined
}

function is_number (char: string): boolean {
  return (char >= '0' && char <= '9') || char === '.' || char === ',' || char === '_'
}

function is_alpha (char: string): boolean {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
}
