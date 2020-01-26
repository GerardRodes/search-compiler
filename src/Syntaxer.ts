import { Token, Token_Type, Text_Type, Comparison_Operator, Logical_Operator } from './Tokenizer'

export type Filter_Operator_Type = Logical_Operator
export const Filter_Operator_Type = { ...Logical_Operator }

export type Condition_Operator_Part_Type = Comparison_Operator
export const Condition_Operator_Part_Type = { ...Comparison_Operator }

export type Condition_Text_Part_Type = Text_Type
export const Condition_Text_Part_Type = { ...Text_Type }

export enum Condition_Type {
  Filter = 'filter',
  Condition = 'condition',
}

export type Node_Type = Condition_Type | Condition_Text_Part_Type | Condition_Operator_Part_Type
export const Node_Type = {
  ...Condition_Type,
  ...Condition_Text_Part_Type,
  ...Filter_Operator_Type,
  ...Condition_Operator_Part_Type
}

interface Node {
  type: Node_Type
}

interface Condition_Part extends Node {
  value: string
}
interface Condition_Text_Part extends Condition_Part {
  type: Condition_Text_Part_Type
}

interface Condition_Operator_Part extends Condition_Part {
  type: Condition_Operator_Part_Type
}

interface Condition extends Node {
  type: Condition_Type.Condition
  attribute: Condition_Text_Part[]
  operator: Condition_Operator_Part[]
  value: Condition_Text_Part[]
}

interface Filter extends Node {
  type: Condition_Type.Filter
  operator: Filter_Operator_Type
  conditions: Array<Condition|Filter>
}

const condition_operator_part_token_types: Set<Token_Type> = new Set(Object.values(Condition_Operator_Part_Type) as Token_Type[])
const condition_text_part_token_types: Set<Token_Type> = new Set(Object.values(Condition_Text_Part_Type) as Token_Type[])

export default function Syntaxer (tokens: Token[]): Filter {
  let current = 0

  function Interpreter_Factory <T extends Condition_Part> (types: Set<Token_Type>, type: string): (tokens: Token[]) => T[] {
    return function (tokens: Token[]): T[] {
      const words: T[] = []

      if (!types.has(tokens[current].type)) {
        throw new SyntaxError(`Unexpected token interpreting condition's ${type}
expected: ${Array.from(types.values()).map(type => `"${type}"`).join(', ')}
got: ${tokens[current].type}
with value: ${tokens[current].value}`)
      }

      while (current < tokens.length && types.has(tokens[current].type)) {
        words.push(tokens[current] as T)
        current++
      }

      return words
    }
  }

  const interpret_attribute = Interpreter_Factory<Condition_Text_Part>(condition_text_part_token_types, 'attribute')
  const interpret_operator = Interpreter_Factory<Condition_Operator_Part>(condition_operator_part_token_types, 'operator')
  const interpret_value = Interpreter_Factory<Condition_Text_Part>(condition_text_part_token_types, 'value')

  function interpret_condition (): Condition {
    const attribute = interpret_attribute(tokens)
    const operator = interpret_operator(tokens)
    const value = interpret_value(tokens)

    return { type: Condition_Type.Condition, attribute, operator, value }
  }

  const filter: Filter = {
    type: Condition_Type.Filter,
    operator: Filter_Operator_Type.And,
    conditions: [interpret_condition()]
  }

  return filter
}
