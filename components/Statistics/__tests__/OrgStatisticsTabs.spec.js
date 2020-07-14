import test from 'ava'
import { mount } from 'enzyme'
import OrgStatisticsTabs from '../OrgStatisticsTabs'
import { Provider } from 'react-redux'

test.before('Setup store', (t) => {
  const organisations = {
    sync: true,
    syncing: false,
    loading: false,
    data: [
      {
        _id: 'abc',
        name: 'ABC'
      },
      {
        _id: 'def',
        name: 'DEF'
      }
    ],
    request: null
  }

  t.context.props = { organisations }

  t.context.store = {
    getState: () => {
      return {
        session: {
          me: {
            orgAdminFor: ['abc', 'def']
          }
        },
        organisations: t.context.props.organisations
      }
    },
    dispatch: () => {},
    subscribe: () => {}
  }
})

test('OrgStatisticsTabs renders organisations correctly', (t) => {
  t.context.props.organisations.loading = false

  const wrapper = mount(
    <Provider store={t.context.store}>
      <OrgStatisticsTabs />
    </Provider>
  )

  t.true(wrapper.exists())
  t.true(wrapper.findWhere((n) => n.text() === 'ABC').exists())
  t.true(wrapper.findWhere((n) => n.text() === 'DEF').exists())
})

test('OrgStatisticsTabs renders loading spinner correctly', (t) => {
  t.context.props.organisations.loading = true

  const wrapper = mount(
    <Provider store={t.context.store}>
      <OrgStatisticsTabs />
    </Provider>
  )

  t.true(wrapper.exists())
  t.true(wrapper.find('LoadSpinner').exists())
})
