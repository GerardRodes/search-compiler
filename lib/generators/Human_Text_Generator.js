function Human_Text_Generator(semantic_tree) {
  return walk_tree(semantic_tree.filter);
}

function walk_tree(node) {
  if (node.type === 'filter') {
    return node.conditions.map(walk_tree).join(node.operator);
  }

  var attr = node.attribute.parts.join(' ');
  var operator = node.operator.type;
  var value = node.value.value;
  return [attr, operator, value].join(' ');
}

export default Human_Text_Generator;
