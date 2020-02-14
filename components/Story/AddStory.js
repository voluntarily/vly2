/*
  Display the new blog creation form
*/
import { Button } from 'antd'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Role } from '../../server/services/authorize/role.js'
import { StoryForm } from '../../components/Story/StoryForm'

const AddStory = ({ roles, onSubmit }) => {
  const blankStory = { name: '', body: '' }
  const [showForm, setShowForm] = useState(false)

  const handleSave = (story) => {
    setShowForm(false)
    onSubmit(story)
  }

  if (roles && (roles.includes(Role.ADMIN) || roles.includes(Role.ORG_ADMIN))) {
    return (
      <>
        <Button type='primary' shape='round' size='large' onClick={() => setShowForm(!showForm)}>
          {showForm
            ? <FormattedMessage id='story.cancel' defaultMessage='Cancel' description='Button to hide the blog creation form' />
            : <FormattedMessage id='story.new' defaultMessage='New Blog' description='Button to create a new blog post' />}
        </Button>
        {showForm && <StoryForm story={blankStory} onSubmit={handleSave} />}
      </>
    )
  } else {
    return null
  }
}

AddStory.propTypes = {
  roles: PropTypes.array,
  onSubmit: PropTypes.func
}

const mapStateToProps = store => ({
  roles: store.session.me.role
})

export default connect(
  mapStateToProps
)(AddStory)
