import { Logical_Operator, Comparison_Operator } from './Tokenizer'
import * as Syntaxer from './Syntaxer'

export interface Condition {
  type: 'condition'
  attribute: string
  operator: Comparison_Operator
  value: string|number
}

export interface Filter {
  type: 'filter'
  operator: Logical_Operator
  conditions: Condition[]
}

export type Node = Filter | Condition

export interface Semantic_Tree {
  filter: Filter
}

/* @todo:
  - replace name for attr with map of { name: attr }
  - transform measurements with Measurement(number, measure)
*/
export default function Semantiker (syntax_tree: Syntaxer.Syntax_Tree): Semantic_Tree {
  return {
    filter: walk_tree(syntax_tree.filter) as Filter
  }
}

function walk_tree (syntax_node: Syntaxer.Syntax_Node): Node {
  if (syntax_node.type === 'filter') {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      type: 'filter',
      operator: syntax_node.operator,
      conditions: syntax_node.conditions.map(walk_tree)
    } as Filter
  }

  if (syntax_node.type !== 'condition') throw new TypeError(`[Semantiker] Expected condition node but found ${syntax_node.type}`)

  return {
    type: 'condition',
    attribute: generate_attribute(syntax_node.attribute),
    operator: generate_operator(syntax_node.operator),
    value: generate_value(syntax_node.value)
  }
}

function generate_attribute (parts: Syntaxer.Condition_Text_Part[]): string {
  return parts.map(part => part.value.toLowerCase()).join('_')
}

function generate_operator (parts: Syntaxer.Condition_Operator_Part[]): Comparison_Operator {
  if (parts.length === 1) {
    return parts[0].type
  }

  const values = new Set(parts.map(part => part.type))

  if (values.size === 1) return values.values().next().value
  if (values.size === 2 && values.has(Comparison_Operator.Not)) {
    values.delete(Comparison_Operator.Not)

    const operator: Comparison_Operator = values.values().next().value
    switch (operator) {
      case Comparison_Operator.Equal:
        return Comparison_Operator.Not_equal
      case Comparison_Operator.Includes:
        return Comparison_Operator.Not_includes

      default:
        throw new Error(`[Semantiker] Operator "${operator}" cannot be negated`)
    }
  }

  return Comparison_Operator.Equal
}

function generate_value (parts: Syntaxer.Condition_Text_Part[]): string {
  return parts.map(part => part.value).join(' ')
}
