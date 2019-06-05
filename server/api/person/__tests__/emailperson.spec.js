import test from 'ava'
import { emailPerson } from '../email/emailperson'

test('Should send verification email to person', async t => {
  const person = {
    name: 'Testy McTestFace',
    nickname: 'Testy',
    phone: '123 456789',
    email: 'andrew@omgtech.co.nz',
    role: 'tester'
  }

  const props = {
    token: '123456789ABCDEF',
    send: true // when true email is actually sent
  }

  const info = await emailPerson(person, 'verify', props)
  // TODO verify templating

  // these pass if send is enabled
  t.true(info.accepted[0] === person.email)
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250.*/, info.response)
})
