import { Icon } from 'antd'
import styled from 'styled-components'
import { OrganisationRole } from '../../server/api/organisation/organisation.constants'

const HorUl = styled.ul`
  margin:0;
  padding:0;
  display inline-block;
  li {
    display: inline;
    padding-right: 1em;
  }
`

const OrgRoleItem = ({ orgRoleItem }) => {
  const roleOptions = [
    { label: <Icon type='bank' />, value: OrganisationRole.VOLUNTEER_PROVIDER },
    { label: <Icon type='read' />, value: OrganisationRole.OPPORTUNITY_PROVIDER },
    { label: <Icon type='thunderbolt' />, value: OrganisationRole.ACTIVITY_PROVIDER },
    { label: <Icon type='thunderbolt' />, value: OrganisationRole.RESOURCE_PROVIDER },
    { label: <Icon type='team' />, value: OrganisationRole.AGENCY },
    { label: <Icon type='team' />, value: OrganisationRole.ADMIN },
    { label: <Icon type='question-circle' />, value: OrganisationRole.OTHER }
  ]
  const item = roleOptions
    .filter(role => role.value === orgRoleItem)[0].label
  return (
    <li>{item}</li>
  )
}

const OrgRole = ({ orgRole }) =>
  <HorUl>
    {orgRole.map((t, index) => <OrgRoleItem key={index} orgRoleItem={t} />)}
  </HorUl>

export default OrgRole
