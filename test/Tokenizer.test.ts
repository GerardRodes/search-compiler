import test from 'ava'
import { Tokenizer } from '../lib/SearchCompiler'

test('Tokenizer handles spaced tokens and operator aliases', t => {
  t.deepEqual(Tokenizer('last name is bla blo'), [
    { type: 'word', value: 'last' },
    { type: 'word', value: 'name' },
    { type: 'equal', value: 'is' },
    { type: 'word', value: 'bla' },
    { type: 'word', value: 'blo' }
  ])

  t.deepEqual(Tokenizer('last name = bla blo'), [
    { type: 'word', value: 'last' },
    { type: 'word', value: 'name' },
    { type: 'equal', value: '=' },
    { type: 'word', value: 'bla' },
    { type: 'word', value: 'blo' }
  ])
})

test('Tokenizer knows numbers', t => {
  t.deepEqual(Tokenizer('1234 >= 4'), [
    { type: 'number', value: '1234' },
    { type: 'greater_or_equal', value: '>=' },
    { type: 'number', value: '4' }
  ])

  t.deepEqual(Tokenizer('1234 >= 4'), [
    { type: 'number', value: '1234' },
    { type: 'greater_or_equal', value: '>=' },
    { type: 'number', value: '4' }
  ])

  t.deepEqual(Tokenizer('1.1'), [
    { type: 'number', value: '1.1' }
  ])
  t.deepEqual(Tokenizer('.1'), [
    { type: 'number', value: '.1' }
  ])
  t.deepEqual(Tokenizer('1,1'), [
    { type: 'number', value: '1,1' }
  ])
  t.deepEqual(Tokenizer('1_1'), [
    { type: 'number', value: '1_1' }
  ])
  t.deepEqual(Tokenizer('1.1Mb'), [
    { type: 'number', value: '1.1' },
    { type: 'word', value: 'Mb' }
  ])
})

test('Tokenizer knows operators', t => {
  t.deepEqual(Tokenizer('= == is equal != or || and && not ! > < >= <='), [
    { type: 'equal', value: '=' },
    { type: 'equal', value: '==' },
    { type: 'equal', value: 'is' },
    { type: 'equal', value: 'equal' },
    { type: 'not_equal', value: '!=' },
    { type: 'or', value: 'or' },
    { type: 'or', value: '||' },
    { type: 'and', value: 'and' },
    { type: 'and', value: '&&' },
    { type: 'not', value: 'not' },
    { type: 'not', value: '!' },
    { type: 'greater', value: '>' },
    { type: 'lower', value: '<' },
    { type: 'greater_or_equal', value: '>=' },
    { type: 'lower_or_equal', value: '<=' }
  ])
})

test('Tokenizer knows wrong operators', t => {
  t.throws<TypeError>(() => Tokenizer('=asd'))
})
