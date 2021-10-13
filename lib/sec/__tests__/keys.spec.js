import test from 'ava'
import { privateKey, publicKey } from '../keys'
import jwt from 'jsonwebtoken'

test('test keys', async t => {
  const pk = privateKey()
  t.regex(pk, /BEGIN RSA/)

  const pubkey = publicKey()
  t.regex(pubkey, /BEGIN PUBLIC/)
})

test('sign with private key', async t => {
  const message = {
    foo: 'bar'
  }
  const options = {
    algorithm: 'RS256',
    expiresIn: '1h'
  }
  const token = jwt.sign(message, privateKey(), options)
  jwt.verify(token, publicKey(),
    {
      maxAge: 60
    },
    (err, decoded) => {
      if (err) {
        console.error(err)
        t.fail()
      }
      t.is(decoded.foo, 'bar')
    })
})

test('Test expired jwt', async t => {
  const message = {
    foo: 'bar'
  }
  const options = {
    algorithm: 'RS256',
    notBefore: '2h',
    expiresIn: '1h'
  }
  const token = jwt.sign(message, privateKey(), options)
  jwt.verify(token, publicKey(),
    {
      maxAge: 60
    },
    (err, decoded) => {
      if (err) {
        t.is(err.name, 'NotBeforeError')
      }
    })
})
