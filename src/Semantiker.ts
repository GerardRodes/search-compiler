import Field_Store from './Field_Store'
import {
  Condition_Operator_Part_Type,
  Filter_Operator_Type,
  Syntax_Tree,
  Syntax_Node,
  Condition_Text_Part,
  Condition_Operator_Part
} from './Syntaxer'

export interface Condition_Operator {
  type: Condition_Operator_Part_Type
  negated: boolean
}
export interface Condition {
  type: 'condition'
  attribute: string
  value: string|number
  operator: Condition_Operator
}

export interface Filter {
  type: 'filter'
  operator: Filter_Operator_Type
  conditions: Array<Condition|Filter>
}

export type Node = Filter | Condition

export interface Semantic_Tree {
  filter: Filter
}

/* @todo:
  - replace name for attr with map of { name: attr }
  - transform measurements with Measurement(number, measure)
*/
export default function Semantiker (syntax_tree: Syntax_Tree, field_store: Field_Store): Semantic_Tree {
  return {
    filter: walk_tree(syntax_tree.filter, field_store) as Filter
  }
}

function walk_tree (syntax_node: Syntax_Node, field_store: Field_Store): Node {
  if (syntax_node.type === 'filter') {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      type: 'filter',
      operator: syntax_node.operator,
      conditions: syntax_node.conditions.map(condition => walk_tree(condition, field_store))
    } as Filter
  }

  if (syntax_node.type !== 'condition') throw new TypeError(`[Semantiker] Expected condition node but found ${syntax_node.type}`)

  const field = field_store.find(syntax_node.attribute)
  return {
    type: 'condition',
    attribute: field != null
      ? field.attribute
      : generate_attribute(syntax_node.attribute),
    operator: generate_operator(syntax_node.operator),
    value: field?.measurement != null
      ? field.measurement.parse(syntax_node.value) ?? generate_value(syntax_node.value)
      : generate_value(syntax_node.value)
  }
}

function generate_attribute (parts: Condition_Text_Part[]): string {
  return parts.map(part => part.value.toLowerCase()).join('_')
}

function generate_value (parts: Condition_Text_Part[]): string {
  return parts.map(part => part.value).join(' ')
}

function generate_operator (parts: Condition_Operator_Part[]): Condition_Operator {
  if (parts.length === 1) {
    return { type: parts[0].type, negated: false }
  }

  const values = new Set(parts.map(part => part.type))
  const negated = values.has(Condition_Operator_Part_Type.Not)

  if (negated) {
    values.delete(Condition_Operator_Part_Type.Not)
  }

  const type = Condition_Operator_Part_Type.Equal
  values.delete(Condition_Operator_Part_Type.Equal)

  if (values.size === 0) return { type, negated }

  if (values.has(Condition_Operator_Part_Type.Or)) {
    if (values.has(Condition_Operator_Part_Type.Greater)) {
      return {
        type: Condition_Operator_Part_Type.Greater_or_equal,
        negated
      }
    } else if (values.has(Condition_Operator_Part_Type.Lower)) {
      return {
        type: Condition_Operator_Part_Type.Lower_or_equal,
        negated
      }
    } else {
      throw new SyntaxError('[Semantiker] A condition operator with and "or" must include also "greater" or "lower"')
    }
  }

  if (values.size !== 1) {
    throw new SyntaxError(`[Semantiker] Found two incompatible operators on condition "${Array.from(values.values()).join(', ')}"`)
  }

  return {
    type: values.values().next().value,
    negated
  }
}
