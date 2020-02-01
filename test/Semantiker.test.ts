import test from 'ava'
import Tokenizer, { Logical_Operator, Comparison_Operator } from '../lib/Tokenizer'
import Syntaxer from '../lib/Syntaxer'
import Semantiker from '../lib/Semantiker'

test('Semantiker handles spaced tokens and operator aliases', t => {
  t.deepEqual(Semantiker(Syntaxer(Tokenizer('last name is not bla blo'))), {
    filter: {
      type: 'filter',
      operator: Logical_Operator.Or,
      conditions: [{
        type: 'condition',
        attribute: 'last_name',
        operator: Comparison_Operator.Not_equal,
        value: 'bla blo'
      }]
    }
  })
})
