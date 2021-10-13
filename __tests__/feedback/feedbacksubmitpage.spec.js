import test from 'ava'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import { Provider } from 'react-redux'
import { FeedbackSubmitPage } from '../../pages/feedback/feedbacksubmitpage'
import sinon from 'sinon'
import * as nextRouter from 'next/router'
import useMockRouter from '../../server/util/useMockRouter'

test.before('Setup Route', useMockRouter('/feedback', { rating: 5, opportunity: 'opportunity_id' }))

test.before('Setup store', t => {
  const members = {
    sync: true,
    syncing: false,
    loading: false,
    data: [
      {
        person: 'person_id',
        status: 'member',
        organisation: { _id: 'organisation_id' }
      }
    ],
    request: null
  }
  const archivedOpportunities = {
    sync: true,
    syncing: false,
    loading: false,
    data: [
      {
        _id: 'opportunity_id',
        fromActivity: 'activity_id'
      }
    ],
    request: null
  }
  const feedback = {
    sync: false,
    syncing: false,
    loading: false,
    data: [
    ],
    request: null
  }

  const feedbackActions = {
    post: sinon.fake()
  }

  t.context.props = { members, archivedOpportunities, feedback, feedbackActions }

  t.context.store = {
    getState: () => {
      return {
        session: {
          me: {
            _id: 'person_id'
          }
        },
        members: t.context.props.members,
        archivedOpportunities: t.context.props.archivedOpportunities,
        feedback: t.context.props.feedback
      }
    },
    dispatch: sinon.fake(),
    subscribe: sinon.fake()
  }
})

test.afterEach.always('Reset mocks', () => {
  sinon.reset()
})

test.after.always('Restore mocks', () => {
  sinon.restore()
})

test.serial('FeedbackSubmitPage renders correctly', t => {
  const wrapper = mountWithIntl(<Provider store={t.context.store}><FeedbackSubmitPage feedbackActions={t.context.props.feedbackActions} /> </Provider>)

  t.true(wrapper.exists())
  t.is(wrapper.find('h1').first().text(), 'Thanks for leaving feedback 🥳')
})

test.serial.cb('FeedbackSubmitPage makes correct request', t => {
  const wrapper = mountWithIntl(<Provider store={t.context.store}><FeedbackSubmitPage feedbackActions={t.context.props.feedbackActions} /> </Provider>)

  t.true(wrapper.exists())

  setTimeout(() => {
    wrapper.update()

    // verify POST feedback has been dispatched
    t.true(t.context.props.feedbackActions.post.calledOnce)
    t.true(t.context.store.dispatch.calledOnce)

    // inspect POST /feedback request body
    const capturedBody = JSON.parse(t.context.props.feedbackActions.post.getCall(0).args[1].body)
    t.truthy(capturedBody)

    const expectedBody = { respondent: 'person_id', respondentOrgs: ['organisation_id'], opportunity: 'opportunity_id', activity: 'activity_id', rating: 5 }
    t.deepEqual(capturedBody, expectedBody)

    t.pass()
    t.end()
  }, 0)
})
