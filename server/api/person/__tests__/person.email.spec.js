import test from 'ava'
import { emailPerson } from '../person.email'
import ops from '../../opportunity/__tests__/opportunity.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import people from './person.fixture'
import objectid from 'objectid'
import { config } from '../../../../config/clientConfig'
import nodemailerMock from 'nodemailer-mock'
import { JSDOM } from 'jsdom'
import { getByText } from '@testing-library/dom'
import { getUnsubscribeLink } from '../person.lib'

test.before(t => {
  process.env.mockEmails = true
  // not using mongo or server here so faking ids
  people.forEach(p => {
    p._id = objectid().toString()
    p.href = `${config.appUrl}/${p._id}`
  })
  const me = people[0]
  const to = people[1] // the interested person

  orgs.forEach(org => { org._id = objectid().toString() })
  const offerOrg = orgs[0]

  // Set myself as the requestor for all of the opportunities, and fake ids
  ops.forEach((op, index) => {
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

test.beforeEach(t => {
  // Reset the mock back to the defaults after each test
  nodemailerMock.mock.reset()
})

test.serial('Send acknowledgeInterest email to person', async t => {
  const props = {
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('interest_vp_ask_accept_interested', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')

  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.truthy(sentMail[0].text.includes('On behalf of Andrew Watkins and the Voluntarily team'))
  t.regex(sentMail[0].subject, /Confirming your interest/)
})

test.serial('render acknowledgeInterest email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op,
    renderonly: true
  }
  const html = await emailPerson('interest_vp_ask_accept_interested', t.context.to, props, true)
  const document = (new JSDOM(html)).window.document
  t.truthy(getByText(document, 'Help make a difference'))
  t.truthy(getByText(document, t.context.op.name))
  t.truthy(getByText(document, `Kia ora ${t.context.to.nickname},`))
})

test.serial('Send invited email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('interest_vp_ask_accept_invited', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')

  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.truthy(sentMail[0].text.includes('Click on the Opportunity link below to accept the invitation'))
  t.regex(sentMail[0].subject, /You're invited to 1 Mentor a year 12 business Impact Project/)
})

test.serial('Send committed email to requestor', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('interest_op_ask_accept_committed', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')

  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)
  t.regex(sentMail[0].subject, /Andrew Watkins just committed to 1 Mentor a year 12 business Impact Project/)
  // TODO: [VP-1341] verify ical attachment for committed email
})

test.serial('Send declined email to volunteer', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('interest_vp_ask_reject_declined', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')
  const sentMail = nodemailerMock.mock.getSentMail()
  t.is(sentMail.length, 1)

  t.truthy(sentMail[0].text.includes('Sorry we have to decline your offer at this time'))
  t.regex(sentMail[0].subject, /update on 1 Mentor a year 12 business Impact Project/)
})

test.serial('Send person interested email to requestor', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op,
    interest: { comment: 'A ll your base belong to us' }
  }
  const info = await emailPerson('interest_op_ask_accept_interested', t.context.to, props)
  t.true(info.accepted[0] === 'accepted')
  const sentMail = nodemailerMock.mock.getSentMail()
  // console.log('sentMail', sentMail)
  t.is(sentMail.length, 1)
  // t.truthy(sentMail[0].text.includes('Andrew Watkins just expressed interest in your opportunity'))
  t.regex(sentMail[0].subject, /Andrew Watkins is interested in 1 Mentor/)
})

test.serial('Email to Voluntarily user includes unsubscribe link', async (t) => {
  const props = {
    from: t.context.me,
    op: t.context.op,
    interest: { comment: 'Test comment' }
  }

  const info = await emailPerson('interest_vp_ask_accept_interested', t.context.to, props)
  const sentMail = nodemailerMock.mock.getSentMail()

  t.true(info.accepted[0] === 'accepted')

  const expectedUnsubscribeLink = getUnsubscribeLink(t.context.to)
  const expectedUnsubscribeText = 'Unsubscribe'

  t.truthy(sentMail[0].text.includes(expectedUnsubscribeLink))
  t.truthy(sentMail[0].text.includes(expectedUnsubscribeText))

  t.truthy(sentMail[0].html.includes(expectedUnsubscribeLink))
  t.truthy(sentMail[0].html.includes(expectedUnsubscribeText))
})

test.serial('Email to anonymous user does not include unsubscribe link', async (t) => {
  const props = {
    from: t.context.me,
    op: t.context.op,
    comment: 'Test comment'
  }

  const to = Object.assign({}, t.context.to)

  // unsubscribe link is generated based on existence of _id
  // so it not being present should result in no unsubscribe link
  delete to._id

  const info = await emailPerson('interest_vp_offer_accept_interested', to, props)
  const sentMail = nodemailerMock.mock.getSentMail()

  t.true(info.accepted[0] === 'accepted')

  const expectedUnsubscribeText = 'Unsubscribe'

  t.falsy(sentMail[0].text.includes(expectedUnsubscribeText))
})

test.serial('sendNotificationEmails flag is respected', async (t) => {
  const props = {
    from: t.context.me,
    op: t.context.op,
    comment: 'Test comment'
  }

  const optedInPerson = Object.assign({}, t.context.to)
  optedInPerson.sendEmailNotifications = true

  const optedOutPerson = Object.assign({}, t.context.to)
  optedOutPerson.sendEmailNotifications = false

  const anonymousPerson = Object.assign({}, t.context.to)
  delete anonymousPerson._id

  const testPeople = [
    {
      person: optedInPerson,
      expectedMailCount: 1
    },
    {
      person: optedOutPerson,
      expectedMailCount: 0
    },
    {
      person: anonymousPerson,
      expectedMailCount: 1
    }
  ]

  for (const testPerson of testPeople) {
    await emailPerson('interest_vp_ask_accept_interested', testPerson.person, props)
    const sentMail = nodemailerMock.mock.getSentMail()

    t.is(sentMail.length, testPerson.expectedMailCount)
    nodemailerMock.mock.reset()
  }
})
