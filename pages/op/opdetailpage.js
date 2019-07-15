import { Button, Divider, message, Popconfirm } from 'antd'
import Link from 'next/link'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import InterestSection from '../../components/Interest/InterestSection'
import RegisterInterestSection from '../../components/Interest/RegisterInterestSection'
import OpDetail from '../../components/Op/OpDetail'
import OpDetailForm from '../../components/Op/OpDetailForm'
import PersonCard from '../../components/Person/PersonCard'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import Loading from '../../components/Loading'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'

const blankOp = {
  title: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  location: '',
  status: 'inactive',
  date: [],
  startDate: null,
  endDate: null,
  tags: []
}

export class OpDetailPage extends Component {
  state = {
    editing: false
  }

  static async getInitialProps ({ store, query }) {
    // Get one Org
    const isNew = query && query.new && query.new === 'new'
    const opExists = !!(query && query.id) // !! converts to a boolean value
    // TODO: [VP-280] run get location and tag data requests in parallel
    await store.dispatch(reduxApi.actions.locations.get())
    await store.dispatch(reduxApi.actions.tags.get())
    if (isNew) {
      return {
        isNew
      }
    } else {
      if (opExists) {
        await store.dispatch(reduxApi.actions.opportunities.get(query))
      }
      return {
        isNew,
        opExists
      }
    }
  }

  componentDidMount () {
    if (this.props.isNew) {
      this.setState({ editing: true })
    }
  }

  async handleSubmit (op) {
    let res = {}
    if (op._id) {
      res = await this.props.dispatch(
        reduxApi.actions.opportunities.put(
          { id: op._id },
          { body: JSON.stringify(op) }
        )
      )
    } else {
      res = await this.props.dispatch(
        reduxApi.actions.opportunities.post(
          {},
          { body: JSON.stringify(op) }
        )
      )
      op = res[0]
      Router.replace(`/ops/${op._id}`)
    }
    this.setState({ editing: false })
    message.success('Saved.')
  }

  handleCancelEdit = () => {
    this.setState({ editing: false })
    if (this.props.isNew) { // return to previous
      Router.back()
    }
  }

  // Called when the user confirms they want to delete an op
  async handleCancelOp (op) {
    if (!op) return
    await this.props.dispatch(reduxApi.actions.opportunities.put({ id: op._id }, { body: JSON.stringify({ status: OpportunityStatus.CANCELLED }) }))
    // TODO: error handling - how can this fail?
    message.success('Request Cancelled. ')
    Router.replace(`/home`)
  }

  // Called when the user starts to delete an op, but then cancels it.
  handleCancelButtonCancelled = () => { message.error('Cancel Request Cancelled') }

  async handledCompleted (op) {
    if (!op) return
    // Data request
    // TODO: change hard coded 'done' string to a constant.
    await this.props.dispatch(reduxApi.actions.opportunities.put({ id: op._id }, { body: JSON.stringify({ status: OpportunityStatus.COMPLETED }) }))
    // TODO: error handling - see above
    message.success('Opportunity Confimed')
    Router.replace(`/archivedops/${op._id}`)
  }

  handledCompletedCancelled = (op) => {
    message.error('Confirm Cancelled')
  }

  render () {
    const me = this.props.me
    const isOrgAdmin = false // TODO: is this person an admin for the org that person belongs to.
    const isAdmin = (me && me.role.includes('admin'))
    let isOwner = false
    let content
    let op
    let organizer
    if (this.props.isNew) {
      op = blankOp
      organizer = me
      isOwner = true
    } else if (this.props.opportunities.loading) {
      content = <Loading><p>Loading details...</p></Loading>
    } else {
      const ops = this.props.opportunities.data
      if (ops.length === 1) {
        op = {
          ...ops[0],
          // tags: this.props.opportunities.data[0].tags.map(op => op.tag),
          startDate: this.props.opportunities.data[0].date[0],
          endDate: this.props.opportunities.data[0].date[1]
        }
        organizer = op.requestor
        isOwner = ((me || {})._id === organizer._id)
      } else { // array must be empty
        // console.log('length', ops.length)
        content = <h2><FormattedMessage id='op.notavailable' defaultMessage='Sorry, this opportunity is not available' description='message on person not found page' /></h2>
      }
    }

    // display permissions
    const canEdit = (isOwner || isOrgAdmin || isAdmin)
    const canManageInterests = (isOwner || isAdmin)
    const canRegisterInterest = (this.props.isAuthenticated && !isOwner)

    const existingTags = this.props.tags.data
    const existingLocations = this.props.locations.data

    const organizerInfo = () => {
      return organizer &&
        <div>
          <h2>
            <FormattedMessage id='organiser' defaultMessage='Requested by' description='Title for organiser card on op details page' />
          </h2>
          <PersonCard style={{ width: '300px' }} person={organizer} />
        </div>
    }
    const volunteerInterestSection = () => {
      return (
        // if not signed in then the interested button signs in first
        !this.props.isAuthenticated
          ? <div>
            <Link href={`/auth/sign-in`} >
              <Button type='primary' shape='round' >
                <FormattedMessage id='iminterested-anon' defaultMessage="I'm Interested" description="I'm interested button that leads to sign in page" />
              </Button>
            </Link>
            <Divider />
          </div>
          : canRegisterInterest && <div>
            <RegisterInterestSection op={op} me={this.props.me._id} />
            <Divider />
          </div>
      )
    }

    /* These components should only appear if a user is logged in and viewing an op they DID create themselves. */
    const ownerManageInterests = () => {
      return (canManageInterests &&
        <div>
          <Popconfirm id='completedOpPopConfirm' title='Confirm completion of this opportunity.' onConfirm={this.handledCompleted.bind(this, op)} onCancel={this.handledCompletedCancelled} okText='Yes' cancelText='No'>
            <Button type='primary' shape='round'>
              <FormattedMessage id='completedOp' defaultMessage='Completed' description='Button to confirm opportunity is completed on OpDetails page' />
            </Button>
          </Popconfirm>
            &nbsp;
          <Popconfirm id='cancelOpPopConfirm' title='Confirm cancel of this opportunity.' onConfirm={this.handleCancelOp.bind(this, op)} onCancel={this.handleCancelButtonCancelled} okText='Yes' cancelText='No'>
            <Button type='danger' shape='round' >
              <FormattedMessage id='cancelOp' defaultMessage='Cancel Request' description='Button to cancel an opportunity on OpDetails page' />
            </Button>
          </Popconfirm>
          <Divider />

          <InterestSection opid={op._id} />
        </div>
      )
    }

    if (!content) {
      if (op && this.state.editing) {
        content = <div>
          <OpDetailForm
            op={op}
            me={me}
            onSubmit={this.handleSubmit.bind(this, op)}
            onCancel={this.handleCancelEdit.bind(this)}
            existingTags={existingTags}
            existingLocations={existingLocations}
          />
        </div>
      } else {
        content = <div>
          { canEdit && <Button id='editOpBtn' style={{ float: 'right' }} type='primary' shape='round' onClick={() => this.setState({ editing: true })} >
            <FormattedMessage id='op.edit' defaultMessage='Edit' description='Button to edit an opportunity' />
          </Button>}

          <OpDetail op={op} />
          {organizerInfo()}
          <Divider />
          {volunteerInterestSection()}
          {ownerManageInterests()}
        </div>
      }
    }

    return (
      <FullPage>
        {content}
      </FullPage>
    )
  }
}

OpDetailPage.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export const OpDetailPageWithOps = withOps(OpDetailPage)
export default publicPage(withOps(OpDetailPage))
