import React from 'react'
import { connect } from 'react-redux'
import publicPage from '../../hocs/publicPage'
import { authorize } from '../../lib/auth/auth0'
import PropTypes from 'prop-types'

class SignIn extends React.Component {
  componentDidMount () {
    authorize({ redirectUrl: this.props.redirectUrl })
  }

  render () {
    return null
  }
}

SignIn.propTypes = {
  redirectUrl: PropTypes.string.isRequired
}

const mapStateToProps = store => ({
  redirectUrl: store.routing.redirectUrl
})

export default connect(
  mapStateToProps
)(publicPage(SignIn))
