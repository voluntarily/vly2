import { Button, Divider, message } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import OpDetail from '../../components/Op/OpDetail'
import OpDetailForm from '../../components/Op/OpDetailForm'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'
import OpOrganizerInfo from '../../components/Op/OpOrganizerInfo'
import OpVolunteerInterestSection from '../../components/Op/OpVolunteerInterestSection'
import OpOwnerManageInterests from '../../components/Op/OpOwnerManageInterests'
import InterestSection from '../../components/Interest/InterestSection'
import OpLoadingPage from './oploadingpage'
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

  constructor (props) {
    super(props)
    this.confirmOpportunity = this.confirmOpportunity.bind(this)
    this.cancelOpportunity = this.cancelOpportunity.bind(this)
    this.isAdmin = this.isAdmin.bind(this)
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

  async confirmOpportunity (op) {
    await this.props.dispatch(reduxApi.actions.opportunities.put({ id: op._id }, { body: JSON.stringify({ status: OpportunityStatus.COMPLETED }) }))
  }

  async cancelOpportunity (op) {
    await this.props.dispatch(reduxApi.actions.opportunities.put({ id: op._id }, { body: JSON.stringify({ status: OpportunityStatus.CANCELLED }) }))
  }

  isAdmin () {
    return this.props.me && this.props.me.role.includes('admin')
  }

  render () {
    // Verifying that we do not show the page unless data has been loaded when the opportunity is not new
    if (!this.props.isNew) {
      if (this.props.opportunities.loading) {
        return (<OpLoadingPage />)
      }
      if (this.props.opportunities.data.length !== 1) {
        return (
          <FullPage>
            <h2>
              <FormattedMessage
                id='op.notavailable'
                defaultMessage='Sorry, this opportunity is not available'
                description='message on person not found page'
              />
            </h2>
          </FullPage>)
      }
    }

    const isOrgAdmin = false // TODO: is this person an admin for the org that person belongs to.
    let isOwner = false
    let op
    let organizer

    if (this.props.isNew) {
      op = blankOp
      organizer = this.props.me
      isOwner = true
    } else {
      op = {
        ...this.props.opportunities.data[0],
        // tags: this.props.opportunities.data[0].tags.map(op => op.tag),
        startDate: this.props.opportunities.data[0].date[0],
        endDate: this.props.opportunities.data[0].date[1]
      }
      organizer = op.requestor
      isOwner = ((this.props.me || {})._id === organizer._id)
    }

    // display permissions
    const canEdit = (isOwner || isOrgAdmin || this.isAdmin())
    const canManageInterests = (isOwner || this.isAdmin())
    const canRegisterInterest = (this.props.isAuthenticated && !isOwner)

    const existingTags = this.props.tags.data
    const existingLocations = this.props.locations.data

    if (op && this.state.editing) {
      return (
        <FullPage>
          <OpDetailForm
            op={op}
            me={this.props.me}
            onSubmit={this.handleSubmit.bind(this, op)}
            onCancel={this.handleCancelEdit.bind(this)}
            existingTags={existingTags}
            existingLocations={existingLocations}
          />
        </FullPage>)
    } else {
      return (
        <FullPage>
          {canEdit &&
            <Button
              id='editOpBtn'
              style={{ float: 'right' }}
              type='primary'
              shape='round'
              onClick={() => this.setState({ editing: true })}>
              <FormattedMessage id='op.edit' defaultMessage='Edit' description='Button to edit an opportunity' />
            </Button>
          }
          <OpDetail
            op={op}
          />
          <OpOrganizerInfo
            organizer={organizer}
          />
          <Divider />
          <OpVolunteerInterestSection
            isAuthenticated={this.props.isAuthenticated}
            canRegisterInterest={canRegisterInterest}
            op={op}
            meID={this.props.me._id}
          />
          <OpOwnerManageInterests
            canManageInterests={canManageInterests}
            op={op}
            confirmOpportunity={this.confirmOpportunity}
            cancelOpportunity={this.cancelOpportunity}
          />
          <Divider />
          <InterestSection opid={op._id} />
        </FullPage>
      )
    }
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
