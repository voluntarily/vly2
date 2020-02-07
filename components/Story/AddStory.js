/*
  Display the new blog creation form
*/
import { Button } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Role } from '../../server/services/authorize/role.js'
import { CreateStory } from '../../components/Story/StoryForm'

const AddStory = ({ roles, ...props }) => {
  const [showForm, setShowForm] = useState(false)
  if (roles && (roles.includes(Role.ADMIN) || roles.includes(Role.ORG_ADMIN))) {
    return (
      <>
        <Button type='primary' shape='round' size='large' onClick={() => setShowForm(!showForm)}>
          {showForm
            ? <FormattedMessage id='story.cancel' defaultMessage='Cancel' description='Button to hide the blog creation form' />
            : <FormattedMessage id='story.new' defaultMessage='New Blog' description='Button to create a new blog post' />}
        </Button>
        {showForm && <CreateStory />}
      </>
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
