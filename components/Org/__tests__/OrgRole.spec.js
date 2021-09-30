import test from 'ava'
import OrgRole from '../OrgRole'
import { render } from 'enzyme'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'

test('OrgRole with single item', t => {
  const one = [OrganisationRole.VOLUNTEER_PROVIDER]
  const wrapper = render(<OrgRole orgRole={one} />)
  t.is(wrapper.find('li').length, 1)
  t.true(wrapper.find('i').first().hasClass('anticon-bank'))
})
test('OrgRole with many item', t => {
  const all = [
    OrganisationRole.VOLUNTEER_PROVIDER,
    OrganisationRole.OPPORTUNITY_PROVIDER,
    OrganisationRole.ACTIVITY_PROVIDER,
    OrganisationRole.AGENCY,
    OrganisationRole.OTHER
  ]
  const wrapper = render(<OrgRole orgRole={all} />)

  t.is(wrapper.find('li').length, all.length)
  t.true(wrapper.find('i').first().hasClass('anticon-bank'))
  t.true(wrapper.find('i').last().hasClass('anticon-question-circle'))
})

test('OrgRole with zero items', t => {
  const none = []
  const wrapper = render(<OrgRole orgRole={none} />)

  t.is(wrapper.find('li').length, 0)
})
