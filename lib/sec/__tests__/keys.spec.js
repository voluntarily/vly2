import test from 'ava'
import { privateKey, publicKey } from '../keys'
import jwt from 'jsonwebtoken'

test('test keys', async t => {
  const pk = privateKey()
  t.is(pk.length, 1679)

  const pubkey = publicKey()
  t.is(pubkey.length, 451)
})

test('sign with private key', async t => {
  const message = {
    foo: 'bar'
  }
  const options = {
    algorithm: 'RS256',
    expiresIn: '1h'
  }
  var token = jwt.sign(message, privateKey(), options)
  jwt.verify(token, publicKey(),
    {
      maxAge: 60
    },
    (err, decoded) => {
      if (err) {
        console.log(err)
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
  var token = jwt.sign(message, privateKey(), options)
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
