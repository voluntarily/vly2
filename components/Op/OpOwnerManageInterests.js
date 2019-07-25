import { Component } from 'react'
import { Button, message, Popconfirm } from 'antd'
import Router from 'next/router'
import { FormattedMessage } from 'react-intl'

export default class OpOwnerManageInterests extends Component {
  constructor (props) {
    super(props)
    this.handledCompleted = this.handledCompleted.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  async handledCompleted () {
    if (!this.props.op) return
    // Confirm Opportunity via Callback
    await this.props.confirmOpportunity(this.props.op)
    message.success('Opportunity Confirmed')
    Router.replace(`/archivedops/${this.props.op._id}`)
  }

  async handleCancel () {
    if (!this.props.op) return
    // Confirm Cancel via Callback
    await this.props.cancelOpportunity(this.props.op)
    message.success('Request Cancelled')
    Router.replace(`/home`)
  }

  handleCancelButtonCancelled = () => {
    message.error('Cancel Request Cancelled')
  }

  handledCompletedCancelled = () => {
    message.error('Confirm Cancelled')
  }

  render () {
    return (
      this.props.canManageInterests &&
      <div>
        <Popconfirm id='completedOpPopConfirm' title='Confirm completion of this opportunity.' onConfirm={this.handledCompleted} onCancel={this.handledCompletedCancelled} okText='Yes' cancelText='No'>
          <Button type='primary' shape='round'>
            <FormattedMessage id='completedOp' defaultMessage='Completed' description='Button to confirm opportunity is completed on OpDetails page' />
          </Button>
        </Popconfirm>
        &nbsp;
        <Popconfirm id='cancelOpPopConfirm' title='Confirm cancel of this opportunity.' onConfirm={this.handleCancel} onCancel={this.handleCancelButtonCancelled} okText='Yes' cancelText='No'>
          <Button type='danger' shape='round' >
            <FormattedMessage id='cancelOp' defaultMessage='Cancel Request' description='Button to cancel an opportunity on OpDetails page' />
          </Button>
        </Popconfirm>
      </div>
    )
  }
}
