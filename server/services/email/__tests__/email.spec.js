import test from 'ava'

import { getTransportTest, getTransportSES } from '../../email/email'

// test.beforeEach('connect and add two person entries', async () => {
//   await Person.create(people).catch(() => 'Unable to create people');
// });

// test.afterEach.always(async () => {
//   await dropDB();
// });

test.skip('Should setup and send test email', async t => {
  t.plan(3)
  const transport = await getTransportTest()
  const info = await transport.sendMail({
    from: 'no-reply@voluntari.ly', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Email Verification ✔', // Subject line
    text: 'Click on the link below to validate your email', // plain text body
    html: '<b>Click on the link below to validate your email</b>' // html body
  })

  t.true(info.accepted[0] === 'bar@example.com')
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250 Accepted.*/, info.response)
})

/* This test sends actual emails via AWS. so do not use
 unless you want to verify the AWS settings
 */
// eslint-disable-next-line ava/no-skip-test
test.skip('send test email via AWS SMTP', async t => {
  t.plan(3)
  const transport = await getTransportSES()
  const info = await transport.sendMail({
    from: 'andrew@voluntari.ly', // sender address
    to: 'andrew@omgtech.co.nz', // list of receivers
    subject: 'Email Verification ✔', // Subject line
    text: 'This is a test email from the email.spec.js test', // plain text body
    html: '<b>This is a test email from the email.spec.js test</b>' // html body
  })
  // eslint-disable-next-line no-console
  console.log(info)
  t.true(info.accepted[0] === 'andrew@omgtech.co.nz')
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250 Ok.*/, info.response)
})
