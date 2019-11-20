import test from 'ava'
import getDomainFromEmail from '../get-domain-from-email'

test('parse email', async (t) => {
  t.is(
    getDomainFromEmail('test@example.com'),
    'example.com'
  )
})
