import test from 'ava'
import Tokenizer, { Token_Type } from '../lib/Tokenizer'

test('Tokenizer handles spaced tokens and operator aliases', t => {
  t.deepEqual(Tokenizer('last name is bla blo'), [
    { type: Token_Type.Word, value: 'last' },
    { type: Token_Type.Word, value: 'name' },
    { type: Token_Type.Equal, value: 'is' },
    { type: Token_Type.Word, value: 'bla' },
    { type: Token_Type.Word, value: 'blo' }
  ])

  t.deepEqual(Tokenizer('last name = bla blo'), [
    { type: Token_Type.Word, value: 'last' },
    { type: Token_Type.Word, value: 'name' },
    { type: Token_Type.Equal, value: '=' },
    { type: Token_Type.Word, value: 'bla' },
    { type: Token_Type.Word, value: 'blo' }
  ])
})

test('trims text', t => {
  t.deepEqual(Tokenizer('   A   >  b             '), [
    { type: Token_Type.Word, value: 'A' },
    { type: Token_Type.Greater, value: '>' },
    { type: Token_Type.Word, value: 'b' }
  ])
})

test('Tokenizer knows numbers', t => {
  t.deepEqual(Tokenizer('1234 >= 4'), [
    { type: Token_Type.Number, value: '1234' },
    { type: Token_Type.Greater_or_equal, value: '>=' },
    { type: Token_Type.Number, value: '4' }
  ])

  t.deepEqual(Tokenizer('1234 >= 4'), [
    { type: Token_Type.Number, value: '1234' },
    { type: Token_Type.Greater_or_equal, value: '>=' },
    { type: Token_Type.Number, value: '4' }
  ])

  t.deepEqual(Tokenizer('1.1'), [
    { type: Token_Type.Number, value: '1.1' }
  ])
  t.deepEqual(Tokenizer('.1'), [
    { type: Token_Type.Number, value: '.1' }
  ])
  t.deepEqual(Tokenizer('1,1'), [
    { type: Token_Type.Number, value: '1,1' }
  ])
  t.deepEqual(Tokenizer('1_1'), [
    { type: Token_Type.Number, value: '1_1' }
  ])
  t.deepEqual(Tokenizer('1.1Mb'), [
    { type: Token_Type.Number, value: '1.1' },
    { type: Token_Type.Word, value: 'Mb' }
  ])
})

test('Tokenizer knows operators', t => {
  t.deepEqual(Tokenizer('= == is equal != or || and && not ! > < >= <='), [
    { type: Token_Type.Equal, value: '=' },
    { type: Token_Type.Equal, value: '==' },
    { type: Token_Type.Equal, value: 'is' },
    { type: Token_Type.Equal, value: 'equal' },
    { type: Token_Type.Not_equal, value: '!=' },
    { type: Token_Type.Or, value: 'or' },
    { type: Token_Type.Or, value: '||' },
    { type: Token_Type.And, value: 'and' },
    { type: Token_Type.And, value: '&&' },
    { type: Token_Type.Not, value: 'not' },
    { type: Token_Type.Not, value: '!' },
    { type: Token_Type.Greater, value: '>' },
    { type: Token_Type.Lower, value: '<' },
    { type: Token_Type.Greater_or_equal, value: '>=' },
    { type: Token_Type.Lower_or_equal, value: '<=' }
  ])
})

test('Tokenizer knows wrong operators', t => {
  t.throws<TypeError>(() => Tokenizer('====='))
})
