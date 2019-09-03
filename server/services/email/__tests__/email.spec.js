import test from 'ava'

import { getTransport, getTransportTest, getTransportSES } from '../../email/email'

test('Check transport is right transport', async t => {
  const t1 = await getTransportSES()
  t.is(t1.options.host, 'email-smtp.us-west-2.amazonaws.com')

  const t2 = await getTransportTest()
  t.is(t2.options.host, 'smtp.ethereal.email')

  const t3 = await getTransport()
  t.is(t3.options.host, 'smtp.ethereal.email')
})

test('Should setup and send test email', async t => {
  t.plan(3)
  const transport = await getTransportTest()
  const info = await transport.sendMail({
    from: 'no-reply@voluntarily.nz', // sender address
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
 to do so add these lines to .env
 SMTP_ID=<aws ses id>
 SMTP_PWD=<aws ses password>
 */
// eslint-disable-next-line ava/no-skip-test
test.skip('send test email via AWS SMTP', async t => {
  t.plan(3)
  const transport = await getTransportSES()
  const info = await transport.sendMail({
    from: 'andrew@voluntarily.nz', // sender address
    to: 'andrew@omgtech.co.nz', // list of receivers
    subject: 'Email Verification ✔', // Subject line
    text: 'This is a test email from the email.spec.js test', // plain text body
    html: '<b>This is a test email from the email.spec.js test</b>' // html body
  })
  // eslint-disable-next-line no-console
  t.true(info.accepted[0] === 'andrew@omgtech.co.nz')
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250 Ok.*/, info.response)
})
