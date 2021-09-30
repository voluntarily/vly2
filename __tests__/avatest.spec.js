/* very quick test to check that ava is ok */
import test from 'ava'



test('foo', t => {
  t.pass()
})

test('bar', async t => {
  const bar = Promise.resolve('bar')
  t.is(await bar, 'bar')
})
