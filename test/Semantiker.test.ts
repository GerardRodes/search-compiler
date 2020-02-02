import test from 'ava'
import Tokenizer, { Logical_Operator, Comparison_Operator } from '../lib/Tokenizer'
import Syntaxer from '../lib/Syntaxer'
import Semantiker from '../lib/Semantiker'
import Field_Store from '../lib/Field_Store'
import Time from '../lib/Time'
import Data_Storage from '../lib/Data_Storage'
import Data_Transmision from '../lib/Data_Transmision'

const empty_store = new Field_Store([])
const field_store = new Field_Store([
  {
    name: 'Last name',
    attribute: 'appellido'
  },
  {
    name: 'Duration',
    attribute: 'duration',
    measurement: new Time()
  },
  {
    name: 'Size',
    attribute: 'size',
    measurement: new Data_Storage()
  },
  {
    name: 'Speed',
    attribute: 'speed',
    measurement: new Data_Transmision()
  }
])

test('Semantiker generates operators', t => {
  t.deepEqual(Semantiker(Syntaxer(Tokenizer('last name is not bla blo')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is equal b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is not equal b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is in b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is not in b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is above b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is above or equal b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a is above or b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a <= b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a not <= b')), empty_store), {
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

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('a not <= b and c is a or a not above a')), empty_store), {
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

test('Semantiker generates attributes', t => {
  t.deepEqual(Semantiker(Syntaxer(Tokenizer('laSt Name is a')), field_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'appellido',
        value: 'a',
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('last name is a')), empty_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'last_name',
        value: 'a',
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })
})

test('Semantiker generates measurement values', t => {
  t.deepEqual(Semantiker(Syntaxer(Tokenizer('duration is 1 hour')), field_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'duration',
        value: 60 * 60,
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('duration is 1 day')), field_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'duration',
        value: 60 * 60 * 24,
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('size is 1MB')), field_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'size',
        value: 8_000_000,
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('size is 1Byte')), field_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'size',
        value: 8,
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('size is 1GiB')), field_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'size',
        value: 8 * Math.pow(2, 30),
        operator: {
          type: Comparison_Operator.Equal,
          negated: false
        }
      }]
    }
  })

  t.deepEqual(Semantiker(Syntaxer(Tokenizer('speed above 1MBps')), field_store), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'speed',
        value: 8 * 1_000_000,
        operator: {
          type: Comparison_Operator.Greater,
          negated: false
        }
      }]
    }
  })
})
