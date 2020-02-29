import { Semantic_Tree, Node } from '../Semantiker'
import {
  Condition_Operator_Part_Type,
  Filter_Operator_Type
} from '../Syntaxer'

interface JSON_Condition {
  operator: Condition_Operator_Part_Type
  attr: string
  value: string|number
  flags?: {
    negated?: boolean
  }
}

export interface JSON_Filter {
  logOperator: Filter_Operator_Type
  conditions: Array<JSON_Condition|JSON_Filter>
}

export default function JSON_Filter_Generator (semantic_tree: Semantic_Tree): JSON_Filter {
  return walk_tree(semantic_tree.filter) as JSON_Filter
}

function walk_tree (node: Node): JSON_Filter | JSON_Condition {
  if (node.type === 'filter') {
    return {
      logOperator: node.operator,
      conditions: node.conditions.map(walk_tree)
    }
  }

  return {
    operator: node.operator.type,
    attr: node.attribute.value,
    value: node.value.value,
    flags: {
      negated: node.operator.negated
    }
  }
}
