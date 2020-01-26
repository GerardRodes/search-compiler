import test from 'ava'
import Syntaxer, { Node_Type, Filter_Operator_Type } from '../lib/Syntaxer'
import Tokenizer from '../lib/Tokenizer'
// import fs from 'fs'

// function toJSON (actual: object, expected: object) {
//   for (const [name, data] of Object.entries({ actual, expected })) {
//     fs.writeFileSync('./' + name + '.json', JSON.stringify(data, null, 2))
//   }
// }

// A and B
// or(and(A, B))

// A or B
// or(A, B)

// A and B or C
// or(and(A, B), C)

// A or B and C
// or(A, and(B, C))

// A and B and C or D
// or(and(A, B, C), D)

// A and B or C or D
// or(and(A, B), C, D)

// A and B or C and D
// or(and(A, B), and(C, D))

// A or B and C or D
// or(A, and(B, or(Z, Y, and(J, L)), C), D)

// tractor es rojo
// {objecto = tractor, operador = igualdad, valor = rojo}

// tractor es rojo y casa tiene perro
// {tractor, igualdad, rojo} Y {casa, contiene, perro}

// tractor es rojo y casa tiene perro o moto mas rapido que 10km/h
// {{tractor, igualdad, rojo} Y {casa, contiene, perro}} O {moto, mayor que, 10km/h}

test('Syntaxer handles spaced tokens and operator aliases', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo')),

    {
      type: Node_Type.Filter,
      operator: Node_Type.Or,
      conditions: [{
        type: Node_Type.Condition,
        attribute: [{ type: Node_Type.Word, value: 'last' }, { type: Node_Type.Word, value: 'name' }],
        operator: [{ type: Node_Type.Equal, value: 'is' }],
        value: [{ type: Node_Type.Word, value: 'bla' }, { type: Node_Type.Word, value: 'blo' }]
      }]
    }

  )
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

test('Syntaxer handles spaced multiple conditions', t => {
  t.deepEqual(Syntaxer(Tokenizer('last name is bla blo and first name = blu ble')), {
    type: Node_Type.Filter,
    operator: Node_Type.Or,
    conditions: [{
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
    }]
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

test('Syntaxer handles A or B and C or D', t => {
  t.deepEqual(Syntaxer(Tokenizer('A=a or B=b and C=c or D=d')), {
    type: Node_Type.Filter,
    operator: Filter_Operator_Type.Or,
    conditions: [
      { type: Node_Type.Condition, attribute: [{ type: Node_Type.Word, value: 'A' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Word, value: 'a' }] },
      {
        type: Node_Type.Filter,
        operator: Filter_Operator_Type.And,
        conditions: [
          { type: Node_Type.Condition, attribute: [{ type: Node_Type.Word, value: 'B' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Word, value: 'b' }] },
          { type: Node_Type.Condition, attribute: [{ type: Node_Type.Word, value: 'C' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Word, value: 'c' }] }
        ]
      },
      { type: Node_Type.Condition, attribute: [{ type: Node_Type.Word, value: 'D' }], operator: [{ type: Node_Type.Equal, value: '=' }], value: [{ type: Node_Type.Word, value: 'd' }] }
    ]
  })
})
