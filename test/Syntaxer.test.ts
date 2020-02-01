import test from 'ava'
import Tokenizer from '../lib/Tokenizer'
import Syntaxer, { Node_Type, Filter_Operator_Type } from '../lib/Syntaxer'

test('Syntaxer handles spaced tokens and operator aliases', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo')), {
    filter: {
      type: Node_Type.Filter,
      operator: Node_Type.Or,
      conditions: [{
        type: Node_Type.Condition,
        attribute: [{ type: Node_Type.Remaining, value: 'last' }, { type: Node_Type.Remaining, value: 'name' }],
        operator: [{ type: Node_Type.Equal, value: 'is' }],
        value: [{ type: Node_Type.Remaining, value: 'bla' }, { type: Node_Type.Remaining, value: 'blo' }]
      }]
    }
  })
})

test('Syntaxer handles filter as condition', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo or first name = blu ble')), {
    filter: {
      type: Node_Type.Filter,
      operator: Node_Type.Or,
      conditions: [
        {
          type: Node_Type.Condition,
          attribute: [{ type: Node_Type.Remaining, value: 'last' }, { type: Node_Type.Remaining, value: 'name' }],
          operator: [{ type: Node_Type.Equal, value: 'is' }],
          value: [{ type: Node_Type.Remaining, value: 'bla' }, { type: Node_Type.Remaining, value: 'blo' }]
        },
        {
          type: Node_Type.Condition,
          attribute: [{ type: Node_Type.Remaining, value: 'first' }, { type: Node_Type.Remaining, value: 'name' }],
          operator: [{ type: Node_Type.Equal, value: '=' }],
          value: [{ type: Node_Type.Remaining, value: 'blu' }, { type: Node_Type.Remaining, value: 'ble' }]
        }
      ]
    }
  })
})

test('Syntaxer handles spaced multiple conditions', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo and first name = blu ble')), {
    filter: {
      type: Node_Type.Filter,
      operator: Node_Type.Or,
      conditions: [{
        type: Node_Type.Filter,
        operator: Node_Type.And,
        conditions: [
          {
            type: Node_Type.Condition,
            attribute: [{ type: Node_Type.Remaining, value: 'last' }, { type: Node_Type.Remaining, value: 'name' }],
            operator: [{ type: Node_Type.Equal, value: 'is' }],
            value: [{ type: Node_Type.Remaining, value: 'bla' }, { type: Node_Type.Remaining, value: 'blo' }]
          },
          {
            type: Node_Type.Condition,
            attribute: [{ type: Node_Type.Remaining, value: 'first' }, { type: Node_Type.Remaining, value: 'name' }],
            operator: [{ type: Node_Type.Equal, value: '=' }],
            value: [{ type: Node_Type.Remaining, value: 'blu' }, { type: Node_Type.Remaining, value: 'ble' }]
          }
        ]
      }]
    }
  })
})

test('Syntaxer handles filter as condition with different operators', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo and first name = blu ble or color has blue')), {
    filter: {
      type: Node_Type.Filter,
      operator: Node_Type.Or,
      conditions: [
        {
          type: Node_Type.Filter,
          operator: Node_Type.And,
          conditions: [
            {
              type: Node_Type.Condition,
              attribute: [{ type: Node_Type.Remaining, value: 'last' }, { type: Node_Type.Remaining, value: 'name' }],
              operator: [{ type: Node_Type.Equal, value: 'is' }],
              value: [{ type: Node_Type.Remaining, value: 'bla' }, { type: Node_Type.Remaining, value: 'blo' }]
            },
            {
              type: Node_Type.Condition,
              attribute: [{ type: Node_Type.Remaining, value: 'first' }, { type: Node_Type.Remaining, value: 'name' }],
              operator: [{ type: Node_Type.Equal, value: '=' }],
              value: [{ type: Node_Type.Remaining, value: 'blu' }, { type: Node_Type.Remaining, value: 'ble' }]
            }
          ]
        },
        {
          type: Node_Type.Condition,
          attribute: [{ type: Node_Type.Remaining, value: 'color' }],
          operator: [{ type: Node_Type.Includes, value: 'has' }],
          value: [{ type: Node_Type.Remaining, value: 'blue' }]
        }
      ]
    }
  })
})

test('Syntaxer handles A or B and C or D', t => {
  t.deepEqual(Syntaxer(Tokenizer('A=a or B=b and C=c or D=d')), {
    filter: {
      type: Node_Type.Filter,
      operator: Filter_Operator_Type.Or,
      conditions: [
        { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'A' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'a' }] },
        {
          type: Node_Type.Filter,
          operator: Filter_Operator_Type.And,
          conditions: [
            { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'B' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'b' }] },
            { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'C' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'c' }] }
          ]
        },
        { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'D' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'd' }] }
      ]
    }
  })
})

test('Syntaxer handles A and B or C and D', t => {
  t.deepEqual(Syntaxer(Tokenizer('A=a and B=b or C=c and D=d')), {
    filter: {
      type: Node_Type.Filter,
      operator: Filter_Operator_Type.Or,
      conditions: [
        {
          type: Node_Type.Filter,
          operator: Filter_Operator_Type.And,
          conditions: [
            { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'A' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'a' }] },
            { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'B' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'b' }] }
          ]
        },
        {
          type: Node_Type.Filter,
          operator: Filter_Operator_Type.And,
          conditions: [
            { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'C' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'c' }] },
            { type: Node_Type.Condition, attribute: [{ type: Node_Type.Remaining, value: 'D' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Remaining, value: 'd' }] }
          ]
        }
      ]
    }
  })
})

test('Syntaxer throws on imcomplete condition', t => {
  t.throws<SyntaxError>(() => Syntaxer(Tokenizer('A=')))
})

test('Syntaxer throws on imcomplete filter', t => {
  t.throws<SyntaxError>(() => Syntaxer(Tokenizer('A=a or')))
})

test('Syntaxer throws on wrong filter', t => {
  t.throws<SyntaxError>(() => Syntaxer(Tokenizer('or')))
})
