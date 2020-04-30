import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Popover } from 'antd'

// converts a person role to a translated string
export const PersonRole = ({ role }) => {
  const roleOptions = {
    admin: <FormattedMessage id='admin' defaultMessage='Admin' />,
    orgAdmin: <FormattedMessage id='orgAdmin' defaultMessage='Organisation-Admin' />,
    // opportunityProvider: <FormattedMessage id='opportunityProvider' defaultMessage='Make Requests' />,
    basic: <FormattedMessage id='basic' defaultMessage='Asker' />,
    volunteer: <FormattedMessage id='volunteer' defaultMessage='Volunteer' />,
    activityProvider: <FormattedMessage id='activityProvider' defaultMessage='Activity Provider' />,
    resourceProvider: <FormattedMessage id='resourceProvider' defaultMessage='Resource Provider' />,
    support: <FormattedMessage id='support' defaultMessage='Help Desk' />
  }
  return roleOptions[role] || null
}

// converts a person role to a translated string
const roleIcons = {
  admin: '🌟',
  orgAdmin: '⭐',
  support: '💁',
  activityProvider: '🧑‍💻',
  resourceProvider: '🧑‍💻',
  volunteer: '🤙', // 🤝,
  basic: '🙋'
  // opportunityProvider: '🤝'
}

export const PersonRoleIcon = ({ role }) => {
  return roleIcons[role] || null
}

const RoleSpan = styled.span`
  ::after { 
    content: ' | '
  }
  :last-child {
    ::after { 
      content: ''
    }
  }
`

export const PersonRoles = ({ roles }) =>
  roles
    ? (
      <>
        {roles.map(role =>
          roleIcons[role] &&
            <RoleSpan key={role}>
              <PersonRoleIcon role={role} /><PersonRole role={role} />
            </RoleSpan>)}
      </>)
    : null

const RoleBadge = styled.span`
  // background-color: #fff;
  // border: solid 1px #a08db8;
  // border-radius: 100%;
  padding: 0.2rem ;
  // margin-left: 0.5rem;
`
export const PersonRoleIcons = ({ roles }) => {
  const key = Object.keys(roleIcons).find(role => roles.includes(role))
  return (key &&
    <Popover content={<PersonRoles roles={roles} />} title='Role' trigger='hover'>
      <RoleBadge>{roleIcons[key]}</RoleBadge>
    </Popover>
  )
}
export default PersonRoles
