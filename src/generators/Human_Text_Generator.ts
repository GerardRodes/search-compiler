import { Semantic_Tree, Node, Condition_Operator } from '../Semantiker'
import { Condition_Operator_Part_Type } from '../Syntaxer'
import Field_Store from '../Field_Store'

export default function Human_Text_Generator (semantic_tree: Semantic_Tree, field_store: Field_Store = new Field_Store()): string {
  return walk_tree(semantic_tree.filter, field_store)
}

function walk_tree (node: Node, field_store: Field_Store): string {
  if (node.type === 'filter') {
    return node.conditions.map(c => walk_tree(c, field_store)).join(' ' + node.operator + ' ')
  }

  const attr = node.attribute.value in field_store.by_attr
    ? field_store.by_attr[node.attribute.value].name
    : node.attribute.parts.join(' ')

  const operator = operator_2_text(node.operator)

  const value = node.value.parts.join(' ')

  const parts = [attr, operator, value]

  if (node.operator.type === Condition_Operator_Part_Type.Includes) {
    parts.reverse()
  }

  return parts.join(' ')
}

const THAN = new Set(['greater', 'lower'])
const TO = new Set(['equal', 'greater_or_equal', 'lower_or_equal'])
function operator_2_text (operator: Condition_Operator): string {
  let text = operator.type.replace(/_/g, ' ')

  if (operator.negated) {
    if (operator.type === Condition_Operator_Part_Type.Includes) {
      text = 'does not ' + text.slice(0, -1)
    } else {
      text = 'not ' + text
    }
  }

  if (THAN.has(operator.type)) {
    return `is ${text} than`
  }

  if (TO.has(operator.type)) {
    return `is ${text} to`
  }

  return text
}
