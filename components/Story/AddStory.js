/*
  Display the new blog creation form
*/
import { Button } from 'antd'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Role } from '../../server/services/authorize/role.js'
// todo if image is not present then use a fallback.
const AddStory = ({ roles, ...props }) => {
  if (roles && (roles.includes(Role.ADMIN) || roles.includes(Role.ORG_ADMIN))) {
    return (
      <Link href=''>
        <Button type='primary' shape='round' size='large'>
          <FormattedMessage
            id='story.new'
            defaultMessage='New Blog'
            description='Button to create a new blog'
          />
        </Button>
      </Link>
    )
  } else {
    return null
  }
}

AddStory.propTypes = {
  roles: PropTypes.array
}

const mapStateToProps = store => ({
  roles: store.session.me.role
})

export default connect(
  mapStateToProps
)(AddStory)
