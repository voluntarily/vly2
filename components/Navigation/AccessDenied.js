import { FormattedMessage } from 'react-intl'
import { FullPage } from '../VTheme/VTheme'

export const AccessDenied = () =>
  <FullPage>
    <h1>
      <FormattedMessage
        id='admin-page.access-denied.heading'
        defaultMessage='Access denied'
        description='Heading shown when a person does not have permission to view an admin page'
      />
    </h1>
    <p>
      <FormattedMessage
        id='admin-page.access-denied.content'
        defaultMessage='You do not have permission to view this page.'
        description='Content shown when a person does not have permission to view an admin page'
      />
    </p>
  </FullPage>

export default AccessDenied
