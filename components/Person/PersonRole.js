import { FormattedMessage } from 'react-intl'

// converts a person role to a translated string
export const PersonRole = ({ role }) => {
  const roleOptions = {
    admin: <FormattedMessage id='admin' defaultMessage='Admin' />,
    orgAdmin: <FormattedMessage id='orgAdmin' defaultMessage='Organisation Admin' />,
    opportunityProvider: <FormattedMessage id='opportunityProvider' defaultMessage='Requestor' />,
    volunteer: <FormattedMessage id='volunteer' defaultMessage='Volunteer' />,
    activityProvider: <FormattedMessage id='activityProvider' defaultMessage='Activity Provider' />,
    resourceProvider: <FormattedMessage id='resourceProvider' defaultMessage='Resource Provider' />,
    tester: <FormattedMessage id='test' defaultMessage='Test' />
  }
  return roleOptions[role] || role
}

const PersonRoles = ({ roles }) =>
  roles && (
    <span>
      {roles.map(role => <span key={role}><PersonRole role={role} /> </span>)}
    </span>)

export default PersonRoles
