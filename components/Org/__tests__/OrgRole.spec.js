import test from 'ava'
import OrgRole, { OrgRoleItem } from '../OrgRole'
import { shallow } from 'enzyme'
import { OrganisationRole } from '../../../server/api/organisation/organisation.constants'

test('OrgRole with single item', t => {
  const one = [OrganisationRole.VOLUNTEER_PROVIDER]
  const wrapper = shallow(<OrgRole orgRole={one} />)
  t.is(wrapper.find('OrgRoleItem').length, 1)
  t.is(wrapper.find('OrgRoleItem').prop('orgRoleItem'), 'vp')
})
test('OrgRole with many item', t => {
  const all = [
    OrganisationRole.VOLUNTEER_PROVIDER,
    OrganisationRole.OPPORTUNITY_PROVIDER,
    OrganisationRole.ACTIVITY_PROVIDER,
    OrganisationRole.AGENCY,
    OrganisationRole.OTHER
  ]
  const wrapper = shallow(<OrgRole orgRole={all} />)
  t.is(wrapper.find('OrgRoleItem').length, all.length)
  t.is(wrapper.find('OrgRoleItem').first().prop('orgRoleItem'), OrganisationRole.VOLUNTEER_PROVIDER)
})

test('OrgRole with zero items', t => {
  const none = []
  const wrapper = shallow(<OrgRole orgRole={none} />)
  t.is(wrapper.find('OrgRoleItem').length, 0)
})

test('OrgRoleItem', t => {
  const wrapper = shallow(<OrgRoleItem orgRoleItem={OrganisationRole.VOLUNTEER_PROVIDER} />)
  t.is(wrapper.find('OrgRoleItem').length, 0)
})
