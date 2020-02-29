import test from 'ava'
import Tokenizer from '../lib/Tokenizer'
import Syntaxer, { Filter_Operator_Type, Condition_Operator_Part_Type } from '../lib/Syntaxer'
import Semantiker from '../lib/Semantiker'
import JSON_Filter_Generator, { JSON_Filter } from '../lib/generators/JSON_Filter_Generator'
import Field_Store from '../lib/Field_Store'

const empty_store = new Field_Store([])

const C = (i: string, s: Field_Store): JSON_Filter => JSON_Filter_Generator(Semantiker(Syntaxer(Tokenizer(i)), s))
test('Semantiker generates operators', t => {
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
})
