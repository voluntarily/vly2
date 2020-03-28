import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

// converts a person role to a translated string
export const PersonRole = ({ role }) => {
  const roleOptions = {
    admin: <FormattedMessage id='admin' defaultMessage='Admin' />,
    orgAdmin: <FormattedMessage id='orgAdmin' defaultMessage='Organisation-Admin' />,
    opportunityProvider: <FormattedMessage id='opportunityProvider' defaultMessage='Requestor' />,
    volunteer: <FormattedMessage id='volunteer' defaultMessage='Volunteer' />,
    activityProvider: <FormattedMessage id='activityProvider' defaultMessage='Activity Provider' />,
    resourceProvider: <FormattedMessage id='resourceProvider' defaultMessage='Resource Provider' />,
    support: <FormattedMessage id='test' defaultMessage='Test' />
  }
  return roleOptions[role] || role
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

const PersonRoles = ({ roles }) =>
  roles
    ? (
      <>
        {roles.map(role => <RoleSpan key={role}><PersonRole role={role} /></RoleSpan>)}
      </>)
    : null

export default PersonRoles
