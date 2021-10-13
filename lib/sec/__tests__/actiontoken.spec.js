import test from 'ava'
import { makeURLToken, handleURLToken } from '../actiontoken'

test('test good token', async t => {
  t.plan(1)
  const payload = {
    landingUrl: '/emailtoken',
    redirectUrl: '/home',
    data: {
      foo: 'bar'
    },
    action: 'test',
    expiresIn: '2h'
  }

  const tok = new URL(makeURLToken(payload)).searchParams.get('token')
  const actionTable = {
    test: (d) => { t.is(d.foo, 'bar') }
  }
  handleURLToken(tok, actionTable)
})

test('test missing action', async t => {
  t.plan(1)
  const payload = {
    landingUrl: '/emailtoken',
    redirectUrl: '/home',
    data: {
      foo: 'bar'
    },
    action: 'test',
    expiresIn: '2h'
  }

  const tok = new URL(makeURLToken(payload)).searchParams.get('token')
  const actionTable = {
    notest: (d) => { t.is(d.foo, 'bar') }
  }
  t.falsy(handleURLToken(tok, actionTable))
})

test('test bad token', async t => {
  t.plan(1)
  const payload = {
    landingUrl: '/random',
    data: {
      foo: 'bar'
    },
    action: 'test'
  }

  const q = new URL(makeURLToken(payload))
  const tok = `${q.searchParams.get('token')}BAD`
  const actionTable = {
    test: (d) => { t.is(d.foo, 'bar') }
  }
  t.throws(() => handleURLToken(tok, actionTable), null, 'invalid signature')
})
