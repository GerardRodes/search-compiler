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

export type Node_Type = Filter_Operator_Type | Condition_Type | Condition_Text_Part_Type | Condition_Operator_Part_Type
export const Node_Type = {
  ...Filter_Operator_Type,
  ...Condition_Type,
  ...Condition_Text_Part_Type,
  ...Condition_Operator_Part_Type
}

interface Node {
  type: Node_Type
}

interface Value_Node extends Node {
  value: string
}
interface Condition_Text_Part extends Value_Node {
  type: Condition_Text_Part_Type
}

interface Condition_Operator_Part extends Value_Node {
  type: Condition_Operator_Part_Type
}

interface Condition extends Node {
  type: Condition_Type.Condition
  attribute: Condition_Text_Part[]
  operator: Condition_Operator_Part[]
  value: Condition_Text_Part[]
}

interface Filter_Operator extends Value_Node {
  type: Filter_Operator_Type
  values: string []
}

type FilterConditions = Array<Condition|Filter>
interface Filter extends Node {
  type: Condition_Type.Filter
  operator: Filter_Operator_Type
  conditions: FilterConditions
}

const filter_operator_token_types: Set<Token_Type> = new Set(Object.values(Filter_Operator_Type) as Token_Type[])
const condition_operator_part_token_types: Set<Token_Type> = new Set(Object.values(Condition_Operator_Part_Type) as Token_Type[])
const condition_text_part_token_types: Set<Token_Type> = new Set(Object.values(Condition_Text_Part_Type) as Token_Type[])

function NewSyntaxError (scope: string, part: string, explanation: {[key: string]: string}): SyntaxError {
  const msg = `Unexpected token interpreting ${scope}'s ${part}`
  const explanation_msg = Object.entries(explanation).map(([key, val]) => key + ': ' + val).join('\n')
  return new SyntaxError(msg + '\n' + explanation_msg)
}

export default function Syntaxer (tokens: Token[]): Filter {
  let current = 0

  function Interpreter_Factory <T extends Value_Node> (types: Set<Token_Type>, type: string, from: string): () => T[] {
    return function (): T[] {
      const words: T[] = []

      if (!types.has(tokens[current].type)) {
        throw NewSyntaxError(from, type, {
          expected: Array.from(types.values()).map(type => `"${type}"`).join(', '),
          got: tokens[current].type,
          'with value': tokens[current].value
        })
      }

      while (current < tokens.length && types.has(tokens[current].type)) {
        words.push(tokens[current] as T)
        current++
      }

      return words
    }
  }

  const interpret_filter_operator = Interpreter_Factory<Filter_Operator>(filter_operator_token_types, 'operator', 'filter')

  const interpret_condition_attribute = Interpreter_Factory<Condition_Text_Part>(condition_text_part_token_types, 'attribute', 'condition')
  const interpret_condition_operator = Interpreter_Factory<Condition_Operator_Part>(condition_operator_part_token_types, 'operator', 'condition')
  const interpret_condition_value = Interpreter_Factory<Condition_Text_Part>(condition_text_part_token_types, 'value', 'condition')

  function interpret_condition (): Condition {
    const attribute = interpret_condition_attribute()
    const operator = interpret_condition_operator()
    const value = interpret_condition_value()

    return { type: Condition_Type.Condition, attribute, operator, value }
  }

  function interpret_filter (operator: Filter_Operator_Type, conditions: FilterConditions): Filter {
    const filter: Filter = {
      type: Condition_Type.Filter,
      operator,
      conditions
    }

    while (current < tokens.length) {
      filter.conditions.push(interpret_condition())

      if (current === tokens.length) break

      const next_operators = interpret_filter_operator()
      if (next_operators.length !== 1) {
        throw NewSyntaxError('filter', 'operator', {
          expected: '1 operator',
          found: `${next_operators.length} operators`,
          'with values': next_operators.map(o => o.value).join(', ')
        })
      }
      const next_operator_type = next_operators[0].type

      if (next_operator_type === operator) continue

      if (next_operator_type === Filter_Operator_Type.And) {
        filter.conditions.push(interpret_filter(next_operator_type, [filter.conditions.pop()]))
      } else {
        return filter
      }
    }

    return filter
  }

  return interpret_filter(Filter_Operator_Type.Or, [])
}
