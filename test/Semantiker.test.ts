import test from 'ava'
import Tokenizer, { Logical_Operator, Comparison_Operator } from '../lib/Tokenizer'
import Syntaxer from '../lib/Syntaxer'
import Semantiker from '../lib/Semantiker'

test('Semantiker compound operatores', t => {
  t.deepEqual(Semantiker(Syntaxer(Tokenizer('last name is not bla blo'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'last_name',
        value: 'bla blo',
        operator: {
          type: Comparison_Operator.Equal,
          negated: true
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is equal b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is not equal b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Equal,
          negated: true
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is in b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Includes,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is not in b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Includes,
          negated: true
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is above b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Greater,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is above or equal b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Greater_or_equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is above or b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Greater_or_equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a <= b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Lower_or_equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a not <= b'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'a',
        value: 'b',
        operator: {
          type: Comparison_Operator.Lower_or_equal,
          negated: true
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a not <= b and c is a or a not above a'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [
        {
          type: 'filter',
          operator: Logical_Operator.And,
          conditions: [
            {
              type: 'condition',
              attribute: 'a',
              value: 'b',
              operator: {
                type: Comparison_Operator.Lower_or_equal,
                negated: true
              }
            },
            {
              type: 'condition',
              attribute: 'c',
              value: 'a',
              operator: {
                type: Comparison_Operator.Equal,
                negated: false
              }
            }
          ]
        },
        {
          type: 'condition',
          attribute: 'a',
          value: 'a',
          operator: {
            type: Comparison_Operator.Greater,
            negated: true
          }
        }
      ]
    }
  })
})
