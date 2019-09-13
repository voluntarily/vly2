import { message } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import React from 'react'
import OpDetailForm from '../../components/Op/OpDetailForm'
import { FullPage } from '../../components/VTheme/VTheme'

export default class OpEditPage extends React.Component {
  async handleSubmit (op) {
    if (op._id) {
      op = await this.props.createOpportunity(op)
    } else {
      op = await this.props.updateOpportunity(op)
    }
    Router.replace(`/ops/${op._id}`)
    message.success('Saved.')
  }

  render () {
    return (
      <FullPage>
        <OpDetailForm
          op={this.props.op}
          me={this.props.me}
          onSubmit={this.handleSubmit.bind(this, this.props.op)}
          onCancel={this.props.stopEditing}
          existingTags={this.props.existingTags}
          existingLocations={this.props.existingLocations}
        />
      </FullPage>)
  }
}

OpEditPage.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.string,
    duration: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.array,
    status: PropTypes.string,

    tags: PropTypes.arrayOf(
      PropTypes.shape({
        tag: PropTypes.string.isRequired,
        _id: PropTypes.string
      })
    )
  }),
  me: PropTypes.shape({
    _id: PropTypes.string
  }),
  existingTags: PropTypes.arrayOf(PropTypes.shape({
    tag: PropTypes.string.isRequired,
    _id: PropTypes.string
  })).isRequired,
  existingLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
  stopEditing: PropTypes.func.isRequired,
  createOpportunity: PropTypes.func.isRequired,
  updateOpportunity: PropTypes.func.isRequired
}
