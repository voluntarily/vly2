import test from 'ava'
import { defaultToHttpScheme } from '../urlUtil'

test('defaultToHttpScheme - falsey returns empty string', t => {
  t.is(defaultToHttpScheme(''), '')
  t.is(defaultToHttpScheme(undefined), '')
  t.is(defaultToHttpScheme(null), '')
  t.is(defaultToHttpScheme('   '), '')
})

test('defaultToHttpScheme - no scheme', t => {
  t.is(defaultToHttpScheme('space.com'), 'http://space.com')
  t.is(defaultToHttpScheme('subdomain.space.com'), 'http://subdomain.space.com')
})

test('defaultToHttpScheme - scheme', t => {
  t.is(defaultToHttpScheme('http://space.com'), 'http://space.com')
  t.is(defaultToHttpScheme('http://subdomain.space.com'), 'http://subdomain.space.com')

  t.is(defaultToHttpScheme('https://space.com'), 'https://space.com')
  t.is(defaultToHttpScheme('https://subdomain.space.com'), 'https://subdomain.space.com')
})

test('defaultToHttpScheme - existing scheme', t => {
  t.is(defaultToHttpScheme('ftp://space.com'), 'ftp://space.com')
})
