import {
  BankOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  TeamOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'

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
    { label: <BankOutlined />, value: OrganisationRole.VOLUNTEER_PROVIDER },
    { label: <ReadOutlined />, value: OrganisationRole.OPPORTUNITY_PROVIDER },
    { label: <ThunderboltOutlined />, value: OrganisationRole.ACTIVITY_PROVIDER },
    { label: <ThunderboltOutlined />, value: OrganisationRole.RESOURCE_PROVIDER },
    { label: <TeamOutlined />, value: OrganisationRole.AGENCY },
    { label: <TeamOutlined />, value: OrganisationRole.ADMIN },
    { label: <QuestionCircleOutlined />, value: OrganisationRole.OTHER }
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
