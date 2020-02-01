import test from 'ava'
import Tokenizer from '../lib/Tokenizer'
import Syntaxer from '../lib/Syntaxer'
import Semantiker from '../lib/Semantiker'

test('Syntaxer handles spaced tokens and operator aliases', t => {
  t.deepEqual(Semantiker(Syntaxer(Tokenizer('last name is bla blo'))), {
    filter: {
      type: 'filter',
      operator: 'or',
      conditions: [{
        type: 'condition',
        attribute: 'last_value',
        operator: 'equal',
        value: 'bla blo'
      }]
    }
  })
})
