import test from 'ava'
import Tokenizer from '../lib/Tokenizer'
import Syntaxer, { Filter_Operator_Type, Condition_Operator_Part_Type } from '../lib/Syntaxer'
import Semantiker from '../lib/Semantiker'
import JSON_Filter_Generator, { JSON_Filter } from '../lib/generators/JSON_Filter_Generator'
import Field_Store from '../lib/Field_Store'
import Time from '../lib/measurements/Time'
import Data_Storage from '../lib/measurements/Data_Storage'
import Data_Transmision from '../lib/measurements/Data_Transmision'

const empty_store = new Field_Store([])
const field_store = new Field_Store([
  {
    name: 'Last name',
    attribute: 'apellido'
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

const C = (i: string, s: Field_Store): JSON_Filter => JSON_Filter_Generator(Semantiker(Syntaxer(Tokenizer(i)), s))

test('JSON_Filter_Generator generates operators', t => {
  t.deepEqual(C('last name is not bla blo', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'last_name',
      operator: Condition_Operator_Part_Type.Equal,
      value: 'bla blo',
      flags: {
        negated: true
      }
    }]
  })

  t.deepEqual(C('a is equal b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Equal,
      value: 'b',
      flags: {
        negated: false
      }
    }]
  })

  t.deepEqual(C('a != b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Equal,
      value: 'b',
      flags: {
        negated: true
      }
    }]
  })

  t.deepEqual(C('a is not equal b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Equal,
      value: 'b',
      flags: {
        negated: true
      }
    }]
  })

  t.deepEqual(C('a is in b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Includes,
      value: 'b',
      flags: {
        negated: false
      }
    }]
  })

  t.deepEqual(C('a is not in b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Includes,
      value: 'b',
      flags: {
        negated: true
      }
    }]
  })

  t.deepEqual(C('a is above b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Greater,
      value: 'b',
      flags: {
        negated: false
      }
    }]
  })

  t.deepEqual(C('a is above or equal b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Greater_or_equal,
      value: 'b',
      flags: {
        negated: false
      }
    }]
  })

  t.deepEqual(C('a is above or b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Greater_or_equal,
      value: 'b',
      flags: {
        negated: false
      }
    }]
  })

  t.deepEqual(C('a <= b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Lower_or_equal,
      value: 'b',
      flags: {
        negated: false
      }
    }]
  })

  t.deepEqual(C('a not <= b', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'a',
      operator: Condition_Operator_Part_Type.Lower_or_equal,
      value: 'b',
      flags: {
        negated: true
      }
    }]
  })

  t.deepEqual(C('a not <= b and c is a or a not above a', empty_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [
      {
        logOperator: Filter_Operator_Type.And,
        conditions: [{
          attr: 'a',
          operator: Condition_Operator_Part_Type.Lower_or_equal,
          value: 'b',
          flags: {
            negated: true
          }
        }, {
          attr: 'c',
          operator: Condition_Operator_Part_Type.Equal,
          value: 'a',
          flags: {
            negated: false
          }
        }]
      },
      {
        attr: 'a',
        operator: Condition_Operator_Part_Type.Greater,
        value: 'a',
        flags: {
          negated: true
        }
      }
    ]
  })
})

test('JSON_Filter_Generator generates attributes', t => {
  t.deepEqual(C('laSt Name is a', field_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'apellido',
      operator: Condition_Operator_Part_Type.Equal,
      value: 'a',
      flags: {
        negated: false
      }
    }]
  })
})

test('JSON_Filter_Generator generates measurement values', t => {
  t.deepEqual(C('duration is 1 hour', field_store), {
    logOperator: Filter_Operator_Type.Or,
    conditions: [{
      attr: 'duration',
      operator: Condition_Operator_Part_Type.Equal,
      value: 60 * 60,
      flags: {
        negated: false
      }
    }]
  })
})
