import test from 'ava'
import Syntaxer, { Node_Type } from '../lib/Syntaxer'
import Tokenizer from '../lib/Tokenizer'

test('Syntaxer handles spaced tokens and operator aliases', t => {
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

test('Syntaxer handles spaced multiple conditions', t => {
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

test('Syntaxer handles filter as condition', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo or first name = blu ble')), {
    type: Node_Type.Filter,
    operator: Node_Type.Or,
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

test('Syntaxer handles filter as condition with different operators', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo and first name = blu ble or color has blue')), {
    type: Node_Type.Filter,
    operator: Node_Type.Or,
    conditions: [
      {
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
      },
      {
        type: Node_Type.Condition,
        attribute: [{ type: Node_Type.Word, value: 'color' }],
        operator: [{ type: Node_Type.Includes, value: 'has' }],
        value: [{ type: Node_Type.Word, value: 'blue' }]
      }
    ]
  })
})
