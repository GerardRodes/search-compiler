import test from 'ava'

const fn = (): string => 'foo'

test('fn() returns foo', t => {
  t.is(fn(), 'foo')
})
