import test from 'ava'
import { emailPerson } from '../email/emailperson'
import ops from '../../opportunity/__tests__/opportunity.fixture'
import orgs from '../../organisation/__tests__/organisation.fixture'
import people from './person.fixture'
import objectid from 'objectid'
import { config } from '../../../../config/config'
import { JSDOM } from 'jsdom'
import { getByText } from '@testing-library/dom'

test.before('Setup fixtures', (t) => {
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

test.serial('Send acknowledgeInterest email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('acknowledgeInterest', t.context.to, props)
  // these pass if send is enabled
  t.true(info.accepted[0] === t.context.to.email)
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250.*/, info.response)
  t.regex(info.originalMessage.subject, /Confirming your interest/)
})

test.serial('render acknowledgeInterest email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const html = await emailPerson('acknowledgeInterest', t.context.to, props, true)
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
  const info = await emailPerson('invited', t.context.to, props)
  // these pass if send is enabled
  t.true(info.accepted[0] === t.context.to.email)
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250.*/, info.response)
  t.regex(info.originalMessage.subject, /You're invited to/)
})

test.serial('Send committed email to person', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('committed', t.context.to, props)
  // these pass if send is enabled
  t.true(info.accepted[0] === t.context.to.email)
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250.*/, info.response)
  t.regex(info.originalMessage.subject, /just committed to/)
})

test.serial('Send declined email to volunteer', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op
  }
  const info = await emailPerson('declined', t.context.to, props)
  // these pass if send is enabled
  t.true(info.accepted[0] === t.context.to.email)
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250.*/, info.response)
  t.regex(info.originalMessage.subject, /update on/)
})

test.serial('Send person interested email to requestor', async t => {
  const props = {
    send: true, // when true email is actually sent
    from: t.context.me,
    op: t.context.op,
    comment: 'All your base belong to us'
  }
  const info = await emailPerson('interested', t.context.to, props)
  // these pass if send is enabled
  t.true(info.accepted[0] === t.context.to.email)
  t.true(info.rejected.length === 0)
  t.regex(info.response, /250.*/, info.response)
  t.regex(info.originalMessage.subject, /is interested in/)
})
