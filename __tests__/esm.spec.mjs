// simple test of an ESM module.
// try using some very modern features with a transpiler
import test from 'ava'
import { sum, message, Hello } from '../test-utils/esm.mjs'

test('2 + 2 = 4', t => {
  t.is(sum(2, 2), 4)
})

test('message', t => {
  t.true(message.includes('esm.mjs'))
})
