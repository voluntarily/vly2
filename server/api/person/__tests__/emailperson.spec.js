import test from 'ava'
import { emailPerson } from '../email/emailperson'
import ops from '../../opportunity/__tests__/opportunity.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import people from './person.fixture'
import objectid from 'objectid'
import { config } from '../../../../config/config'
import nodemailerMock from 'nodemailer-mock'
import { JSDOM } from 'jsdom'
import { getByText } from '@testing-library/dom'

test.before(t => {
  // not using mongo or server here so faking ids
  people.map(p => {
    p._id = objectid().toString()
    p.href = `${config.appUrl}/${p._id}`
  })
  const me = people[0]
  const to = people[1] // the interested person

  orgs.map(org => { org._id = objectid().toString() })
  const offerOrg = orgs[0]

  // Set myself as the requestor for all of the opportunities, and fake ids
  ops.map((op, index) => {
    op._id = objectid().toString()
    op.requestor = me
    op.offerOrg = offerOrg
    op.href = `${config.appUrl}/${op._id}`
  })
  t.context = {
    me,
    to,
    op: ops[0],
    people,
    ops,
    orgs
  }
})

test.afterEach(t => {
  // Reset the mock back to the defaults after each test
  nodemailerMock.mock.reset()
})

test('Send acknowledgeInterest email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('acknowledgeInterest', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')

  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.truthy(sentMail[0].text.includes('On behalf of Andrew Watkins and the Voluntarily team'))
  t.regex(sentMail[0].subject, /Confirming your interest/)
})

test('render acknowledgeInterest email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op,
    renderonly: true
  }
  const html = await emailPerson('acknowledgeInterest', t.context.to, props, true)
  const document = (new JSDOM(html)).window.document
  t.truthy(getByText(document, 'Help make a difference'))
  t.truthy(getByText(document, t.context.op.name))
  t.truthy(getByText(document, `Kia ora ${t.context.to.nickname},`))
})

test('Send invited email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('invited', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')

  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.truthy(sentMail[0].text.includes('Click on the Opportunity link below to accept the invitation'))
  t.regex(sentMail[0].subject, /You're invited to 1 Mentor a year 12 business Impact Project/)
})

test('Send committed email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('committed', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')

  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.truthy(sentMail[0].text.includes('Andrew Watkins just committed to your opportunity'))
  t.regex(sentMail[0].subject, /Andrew Watkins just committed to 1 Mentor a year 12 business Impact Project/)
})

test('Send declined email to volunteer', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('declined', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')
  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.truthy(sentMail[0].text.includes('Right now we have all the people we need for 1 Mentor a year 12 business'))
  t.regex(sentMail[0].subject, /update on 1 Mentor a year 12 business Impact Project/)
})

test('Send person interested email to requestor', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op,
    comment: 'All your base belong to us'
  }
  const info = await emailPerson('interested', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')
  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.truthy(sentMail[0].text.includes('Andrew Watkins just expressed interest in your opportunity'))
  t.regex(sentMail[0].subject, /Andrew Watkins is interested in 1 Mentor/)
})
