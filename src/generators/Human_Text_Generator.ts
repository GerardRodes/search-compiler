import { Semantic_Tree, Node } from '../Semantiker'

export default function Human_Text_Generator (semantic_tree: Semantic_Tree): string {
  return walk_tree(semantic_tree.filter)
}

function walk_tree (node: Node): string {
  if (node.type === 'filter') {
    return node.conditions.map(walk_tree).join(node.operator)
  }

  const attr = node.attribute.parts.join(' ')
  const operator = node.operator.type
  const value = node.value.value

  return [attr, operator, value].join(' ')
}

function operator_2_text (operator): string {

}
