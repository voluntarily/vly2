import React from 'react'

import { FullPage } from '../components/VTheme/VTheme'
import { FormattedMessage } from 'react-intl'
import { doSignThru } from './securePage'

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

const AccessDeniedPage = publicPage(AccessDenied)

const adminPageHoc = Page => {
  const AdminPage = props =>
    (props.isAuthenticated && props.isAdmin)
      ? <Page {...props} />
      : <AccessDeniedPage />

  AdminPage.getInitialProps = ctx => {
    if (!ctx.store.getState().session.isAuthenticated) {
      doSignThru(ctx)
      return { isAuthenticated: false }
    }

    // securePage always wraps publicPage so we know GIP exists.
    return Page.getInitialProps(ctx)
  }
  return AdminPage
}

export default Page => adminPageHoc(publicPage(Page))
