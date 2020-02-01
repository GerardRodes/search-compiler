import test from 'ava'
import Tokenizer, { Token_Type } from '../lib/Tokenizer'

test('Tokenizer handles spaced tokens and operator aliases', t => {
  t.deepEqual(Tokenizer('last name is bla blo'), [
    { type: Token_Type.Remaining, value: 'last' },
    { type: Token_Type.Remaining, value: 'name' },
    { type: Token_Type.Equal, value: 'is' },
    { type: Token_Type.Remaining, value: 'bla' },
    { type: Token_Type.Remaining, value: 'blo' }
  ])

  t.deepEqual(Tokenizer('last name = bla blo'), [
    { type: Token_Type.Remaining, value: 'last' },
    { type: Token_Type.Remaining, value: 'name' },
    { type: Token_Type.Equal, value: '=' },
    { type: Token_Type.Remaining, value: 'bla' },
    { type: Token_Type.Remaining, value: 'blo' }
  ])
})

test('trims text', t => {
  t.deepEqual(Tokenizer('   A   >  b             '), [
    { type: Token_Type.Remaining, value: 'A' },
    { type: Token_Type.Greater, value: '>' },
    { type: Token_Type.Remaining, value: 'b' }
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
    { type: Token_Type.Remaining, value: 'Mb' }
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

test('Tokenizer knows weird caracters', t => {
  t.deepEqual(Tokenizer('À Á Â Ã Ä Å Æ Ç È É Ê Ë Ì Í Î Ï Ð Ñ Ò Ó Ô Õ Ö × Ø Ù Ú Û Ü Ý Þ ß à á â ã ä å æ ç è'), [
    { type: Token_Type.Remaining, value: 'À' },
    { type: Token_Type.Remaining, value: 'Á' },
    { type: Token_Type.Remaining, value: 'Â' },
    { type: Token_Type.Remaining, value: 'Ã' },
    { type: Token_Type.Remaining, value: 'Ä' },
    { type: Token_Type.Remaining, value: 'Å' },
    { type: Token_Type.Remaining, value: 'Æ' },
    { type: Token_Type.Remaining, value: 'Ç' },
    { type: Token_Type.Remaining, value: 'È' },
    { type: Token_Type.Remaining, value: 'É' },
    { type: Token_Type.Remaining, value: 'Ê' },
    { type: Token_Type.Remaining, value: 'Ë' },
    { type: Token_Type.Remaining, value: 'Ì' },
    { type: Token_Type.Remaining, value: 'Í' },
    { type: Token_Type.Remaining, value: 'Î' },
    { type: Token_Type.Remaining, value: 'Ï' },
    { type: Token_Type.Remaining, value: 'Ð' },
    { type: Token_Type.Remaining, value: 'Ñ' },
    { type: Token_Type.Remaining, value: 'Ò' },
    { type: Token_Type.Remaining, value: 'Ó' },
    { type: Token_Type.Remaining, value: 'Ô' },
    { type: Token_Type.Remaining, value: 'Õ' },
    { type: Token_Type.Remaining, value: 'Ö' },
    { type: Token_Type.Remaining, value: '×' },
    { type: Token_Type.Remaining, value: 'Ø' },
    { type: Token_Type.Remaining, value: 'Ù' },
    { type: Token_Type.Remaining, value: 'Ú' },
    { type: Token_Type.Remaining, value: 'Û' },
    { type: Token_Type.Remaining, value: 'Ü' },
    { type: Token_Type.Remaining, value: 'Ý' },
    { type: Token_Type.Remaining, value: 'Þ' },
    { type: Token_Type.Remaining, value: 'ß' },
    { type: Token_Type.Remaining, value: 'à' },
    { type: Token_Type.Remaining, value: 'á' },
    { type: Token_Type.Remaining, value: 'â' },
    { type: Token_Type.Remaining, value: 'ã' },
    { type: Token_Type.Remaining, value: 'ä' },
    { type: Token_Type.Remaining, value: 'å' },
    { type: Token_Type.Remaining, value: 'æ' },
    { type: Token_Type.Remaining, value: 'ç' },
    { type: Token_Type.Remaining, value: 'è' }
  ])
})

test('Tokenizer knows wrong operators', t => {
  t.throws<TypeError>(() => Tokenizer('====='))
})
