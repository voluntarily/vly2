import test from 'ava'
import nodemailerMock from 'nodemailer-mock'
import { getTransport } from '../email'

test.before('Setup mailer', async (t) => {
  try {
    t.context.transport = await getTransport()
  } catch (err) { console.error(err) }
})

test('Should setup and send test email', async t => {
  // const transport = await getTransportTest()
  const info = await t.context.transport.sendMail({
    from: 'no-reply@vocationally.marscloud.co.nz', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Email Verification ✔', // Subject line
    text: 'Click on the link below to validate your email', // plain text body
    html: '<b>Click on the link below to validate your email</b>' // html body
  })
  t.true(info.accepted[0] === 'accepted')

  // get the array of emails we sent
  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.is(sentMail[0].text, 'Click on the link below to validate your email')
})

/* This test sends actual emails via AWS. so do not use
 unless you want to verify the AWS settings
 to do so add these lines to .env
 SMTP_ID=<aws ses id>
 SMTP_PWD=<aws ses password>
 */
// test.skip('send test email via AWS SMTP', async t => {
//   t.plan(3)
//   const transport = await getTransportSES()
//   const info = await transport.sendMail({
//     from: 'andrew@voluntarily.nz', // sender address
//     to: 'andrew@omgtech.co.nz', // list of receivers
//     subject: 'Email Verification ✔', // Subject line
//     text: 'This is a test email from the email.spec.js test', // plain text body
//     html: '<b>This is a test email from the email.spec.js test</b>' // html body
//   })
//   // eslint-disable-next-line no-console
//   t.true(info.accepted[0] === 'andrew@omgtech.co.nz')
//   t.true(info.rejected.length === 0)
//   t.regex(info.response, /250 Ok.*/, info.response)
// })
