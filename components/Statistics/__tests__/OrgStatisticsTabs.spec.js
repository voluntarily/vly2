import test from 'ava'
import { mount } from 'enzyme'
import { OrgStatisticsTabs } from '../OrgStatisticsTabs'

test('OrgStatisticsTabs renders organisations correctly', (t) => {
  const props = {
    orgAdminFor: ['abc', 'def'],
    organisations: {
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
    },
    organisationsActions: {
      get: () => {}
    },
    dispatch: () => {}
  }
  const wrapper = mount(<OrgStatisticsTabs {...props} />)

  t.true(wrapper.exists())
  t.true(wrapper.findWhere((n) => n.text() === 'ABC').exists())
  t.true(wrapper.findWhere((n) => n.text() === 'DEF').exists())
})

test('OrgStatisticsTabs renders loading spinner correctly', (t) => {
  const props = {
    orgAdminFor: ['abc', 'def'],
    organisations: {
      sync: false,
      syncing: true,
      loading: true,
      data: [
      ],
      request: null
    },
    organisationsActions: {
      get: () => {}
    },
    dispatch: () => {}
  }
  const wrapper = mount(<OrgStatisticsTabs {...props} />)

  t.true(wrapper.exists())
  t.true(wrapper.find('LoadSpinner').exists())
})
