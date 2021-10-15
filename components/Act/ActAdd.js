/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import { Button } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Role } from '../../server/services/authorize/role.js'
// todo if image is not present then use a fallback.
const ActAdd = ({ roles }) => {
  if (roles && roles.includes(Role.ACTIVITY_PROVIDER)) {
    return (
      <Link href='/acts/new' passHref>
        <Button type='primary' block shape='round' size='large'>
          <FormattedMessage
            id='act.new'
            defaultMessage='New Template'
            description='Button to create a new activity on Landing page'
          />
        </Button>
      </Link>
    )
  } else {
    return null
  }
}

ActAdd.propTypes = {
  roles: PropTypes.array
}

const mapStateToProps = store => ({
  roles: store.session.me.role
})

export default connect(
  mapStateToProps
)(ActAdd)
