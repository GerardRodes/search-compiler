function JSON_Filter_Generator(semantic_tree) {
  return walk_tree(semantic_tree.filter);
}

function walk_tree(node) {
  if (node.type === 'filter') {
    return {
      logOperator: node.operator,
      conditions: node.conditions.map(walk_tree)
    };
  }

  return {
    operator: node.operator.type,
    attr: node.attribute.value,
    value: node.value.value,
    flags: {
      negated: node.operator.negated
    }
  };
}

export default JSON_Filter_Generator;
