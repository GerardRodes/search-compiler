import test from 'ava'
import { Tokenizer } from 'search-compiler'

test('fn() returns foo', t => {
  t.is(Tokenizer(), 'foo')
})
