import test from 'ava'
import Syntaxer, { Node_Type } from '../lib/Syntaxer'
import Tokenizer from '../lib/Tokenizer'

test('Tokenizer handles spaced tokens and operator aliases', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo')), {
    type: Node_Type.Filter,
    operator: Node_Type.And,
    conditions: [{
      type: Node_Type.Condition,
      attribute: [{ type: Node_Type.Word, value: 'last' }, { type: Node_Type.Word, value: 'name' }],
      operator: [{ type: Node_Type.Equal, value: 'is' }],
      value: [{ type: Node_Type.Word, value: 'bla' }, { type: Node_Type.Word, value: 'blo' }]
    }]
  })
})

test('Tokenizer handles spaced multiple conditions', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo and first name = blu ble')), {
    type: Node_Type.Filter,
    operator: Node_Type.And,
    conditions: [
      {
        type: Node_Type.Condition,
        attribute: [{ type: Node_Type.Word, value: 'last' }, { type: Node_Type.Word, value: 'name' }],
        operator: [{ type: Node_Type.Equal, value: 'is' }],
        value: [{ type: Node_Type.Word, value: 'bla' }, { type: Node_Type.Word, value: 'blo' }]
      },
      {
        type: Node_Type.Condition,
        attribute: [{ type: Node_Type.Word, value: 'first' }, { type: Node_Type.Word, value: 'name' }],
        operator: [{ type: Node_Type.Equal, value: '=' }],
        value: [{ type: Node_Type.Word, value: 'blu' }, { type: Node_Type.Word, value: 'ble' }]
      }
    ]
  })
})
