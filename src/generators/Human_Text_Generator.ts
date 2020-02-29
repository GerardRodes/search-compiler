import { Semantic_Tree, Node, Condition_Operator } from '../Semantiker'
import { Condition_Operator_Part_Type } from '../Syntaxer'

export default function Human_Text_Generator (semantic_tree: Semantic_Tree): string {
  return walk_tree(semantic_tree.filter)
}

function walk_tree (node: Node): string {
  if (node.type === 'filter') {
    return node.conditions.map(walk_tree).join(' ' + node.operator + ' ')
  }

  const attr = node.attribute.parts.join(' ')
  const operator = operator_2_text(node.operator)
  const value = node.value.value

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
