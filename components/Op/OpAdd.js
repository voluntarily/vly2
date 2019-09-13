/*
  New Opportunity Button
*/
import { Button } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

const OpAdd = ({ roles, ...props }) => {
  if (roles && roles.includes('opportunityProvider')) {
    return (
      <Link href={'/op/new'}>
        <Button type='primary' shape='round' size='large'>
          <FormattedMessage
            id='opAdd.new'
            defaultMessage='New Request'
            description='Button to create a new opportunity multiple pages'
          />
        </Button>
      </Link>
    )
  } else {
    return null
  }
}

OpAdd.propTypes = {
  roles: PropTypes.array
}

// Warning me will be {} if not signed in and role will be undefined.
const mapStateToProps = store => ({
  roles: store.session.me.role || []
})

export default connect(
  mapStateToProps
)(OpAdd)
