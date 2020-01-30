import test from 'ava'
import { jwtVerify, getSigningKey } from '../jwtVerify'
import { jwtData } from './setSession.fixture'

// this may not be valid for long
// const idToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5qSkVRelJGUkRkR01VTTNNemMwUVRreU4wSXpSamhDUlVGRU9FSTFRa0ZCUXprNFJEaEdSQSJ9.eyJuaWNrbmFtZSI6ImFuZHJldyIsIm5hbWUiOiJhbmRyZXdAb21ndGVjaC5jby5ueiIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9lM2RhZTBkYmY5NDU0YmM1ODMwOGViN2MwNDY5NWY0ND9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmFuLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIwLTAxLTMwVDAxOjA0OjQwLjAwMloiLCJlbWFpbCI6ImFuZHJld0BvbWd0ZWNoLmNvLm56IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vdm9sdW50YXJpbHkuYXUuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVkNWY2YThiMzUzMWU2MGRiM2Q4MzljYiIsImF1ZCI6IlM0eWQ0VmdaOTJOSWpod08zdnQ0aDBHaWZiOW1YdjFrIiwiaWF0IjoxNTgwMzQ2MjgwLCJleHAiOjE1ODAzODIyODAsImF0X2hhc2giOiJQUTBaS29NMWZzcndxOFhmZkVJWnNBIiwibm9uY2UiOiJTbDNmQ2I2MFZObTg1b0xBdjB5cmtneTZ3flZwaFZxMiJ9.fAer86JP8sbiSKNar7LRIs0TNmQpP7935uthnPmA87v6mo6iFXZxImq3skPW8FgJID6DhavKInDF-14bAPHILAkhcu3jghL8uBmBzRO3y6CV-6qw--syWnHUgGV45dpDTa0zoINEuRTr0xBdZkOYkJ0I-_JLgctBugPyrzL8FINNQwfMMSjrSc3TO1iajJ_LuhHis37Qr-ow3KSHLnJYfoHFddfb6zUWimBFr5F6x9CDws4GMeW_IFfMVYmrwfrkfbI7YcArDhrvnwMoSl1kbMugVP9_p0MN17p-UDozN9h7MoVfNw-QLw0XSeSdcqAs9Q9G0RqppGatIRozcJ1TCw'
const idToken = jwtData.idToken
test('check fixture token with callback', t => {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: 'NjJEQzRFRDdGMUM3Mzc0QTkyN0IzRjhCRUFEOEI1QkFBQzk4RDhGRA'
  }
  getSigningKey(header, (err, key) => {
    if (err) t.fail()
    // console.log('signingkey', key)
    t.true(key.startsWith('secret'))
  })
  t.pass()
})

test('verify JWT against Auth0 Signing key', async t => {
  t.plan(2)
  try {
    const decoded = await jwtVerify(idToken)
    // console.log(decoded)
    t.is(decoded.nickname, 'avowkind')
  } catch (e) {
    t.fail()
  }

  t.pass()
})
