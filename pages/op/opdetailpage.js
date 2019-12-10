import { Button, Divider } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Loading from '../../components/Loading'
import OpDetail from '../../components/Op/OpDetail'
import OpOwnerManageInterests from '../../components/Op/OpOwnerManageInterests'
import {
  FullPage,
  OpSectionGrid
} from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withMembers, withOps } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'
import OpEditPage from './opeditpage'
import OpUnavailablePage from './opunavailablepage'
import InterestSection from '../../components/Interest/InterestSection'

const blankOp = {
  name: '',
  subtitle: '',
  imgUrl: '/static/img/opportunity/opportunity.png',
  duration: '',
  location: 'Online',
  status: 'inactive',
  date: [],
  startDate: null,
  endDate: null,
  tags: []
}

export class OpDetailPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
    this.confirmOpportunity = this.confirmOpportunity.bind(this)
    this.cancelOpportunity = this.cancelOpportunity.bind(this)
    this.isAdmin = this.isAdmin.bind(this)
    this.isOwner = this.isOwner.bind(this)
    this.canManageInterests = this.canManageInterests.bind(this)
    this.canRegisterInterest = this.canRegisterInterest.bind(this)
    this.retrieveOpportunity = this.retrieveOpportunity.bind(this)
  }

  static async getInitialProps ({ store, query }) {
    // console('getInitialProps: OpDetailPage', store, query)
    const me = store.getState().session.me
    // Get one Org
    const isNew = query && query.new && query.new === 'new'
    const opExists = !!(query && query.id) // !! converts to a boolean value
    await Promise.all([
      store.dispatch(reduxApi.actions.members.get({ meid: me._id })),
      store.dispatch(reduxApi.actions.locations.get()),
      store.dispatch(reduxApi.actions.tags.get())
    ])

    if (isNew) {
      // if there is an act parameter then get the activity and create initial op.
      if (query.act) {
        await store.dispatch(reduxApi.actions.activities.get({ id: query.act }))
      }
      return {
        isNew,
        actid: query.act
      }
    } else {
      if (opExists) {
        query.session = store.getState().session //  Inject session with query that restricted api access
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

  async createOpportunity (op) {
    console.log('createOpportunity:', op)
    const res = await this.props.dispatch(
      reduxApi.actions.opportunities.put(
        { id: op._id },
        { body: JSON.stringify(op) }
      )
    )
    return res[0]
  }

  async updateOpportunity (op) {
    const res = await this.props.dispatch(
      reduxApi.actions.opportunities.post({}, { body: JSON.stringify(op) })
    )
    return res[0]
  }

  stopEditing = () => {
    this.setState({ editing: false })
    if (this.props.isNew) {
      // return to previous
      Router.back()
    }
  }

  async confirmOpportunity (op) {
    await this.props.dispatch(
      reduxApi.actions.opportunities.put(
        { id: op._id },
        { body: JSON.stringify({ status: OpportunityStatus.COMPLETED }) }
      )
    )
  }

  async cancelOpportunity (op) {
    await this.props.dispatch(
      reduxApi.actions.opportunities.put(
        { id: op._id },
        { body: JSON.stringify({ status: OpportunityStatus.CANCELLED }) }
      )
    )
  }

  isAdmin () {
    return this.props.me && this.props.me.role.includes('admin')
  }

  isOwner (op) {
    return (
      this.props.isNew ||
      (this.props.me && op.requestor && this.props.me._id === op.requestor._id)
    )
  }

  canEdit (op) {
    const isOrgAdmin = false // TODO: is this person an admin for the org that person belongs to.
    return this.isOwner(op) || isOrgAdmin || this.isAdmin()
  }

  canManageInterests (op) {
    return this.isOwner(op) || this.isAdmin()
  }

  canRegisterInterest (op) {
    return this.props.isAuthenticated && !this.isOwner(op)
  }

  retrieveOpportunity () {
    if (
      this.props.members.sync &&
      this.props.members.data.length > 0 &&
      this.props.me
    ) {
      this.props.me.orgMembership = this.props.members.data.filter(m =>
        [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status)
      )
    }

    let op
    if (this.props.isNew) {
      op = blankOp

      // init from activity if provided
      if (this.props.actid) {
        const act = this.props.activities.data[0]
        op = {
          ...blankOp,
          name: act.name,
          subtitle: act.subtitle,
          description: act.description,
          imgUrl: act.imgUrl,
          duration: act.duration,
          tags: act.tags,
          fromActivity: this.props.actid
        }
      }
      op.requestor = this.props.me

      // set init offerOrg to first membership result
      if (
        this.props.me.orgMembership &&
        this.props.me.orgMembership.length > 0
      ) {
        op.offerOrg = {
          _id: this.props.me.orgMembership[0].organisation._id
        }
      }
    } else {
      op = {
        ...this.props.opportunities.data[0],
        // tags: this.props.opportunities.data[0].tags.map(op => op.tag),
        startDate: this.props.opportunities.data[0].date[0],
        endDate: this.props.opportunities.data[0].date[1]
      }
    }
    return op
  }

  handleEditClicked = () => {
    this.setState({
      editing: !this.state.editing
    })
  }

  render () {
    // Verifying that we do not show the page unless data has been loaded when the opportunity is not new
    if (!this.props.isNew) {
      if (!this.props.opportunities.sync) {
        return <Loading />
      }
      if (this.props.opportunities.data.length === 0) {
        return <OpUnavailablePage />
      }
    }

    const op = this.retrieveOpportunity()

    if (op && this.state.editing) {
      return (
        <OpEditPage
          op={op}
          me={this.props.me}
          existingTags={this.props.tags.data}
          existingLocations={this.props.locations.data}
          stopEditing={this.stopEditing.bind(this)}
          updateOpportunity={this.updateOpportunity.bind(this)}
          createOpportunity={this.createOpportunity.bind(this)}
        />
      )
    } else {
      return (
        !this.props.isNew && (
          <FullPage>
            <OpDetail
              op={op}
              onEditClicked={this.handleEditClicked}
              canEdit={this.canEdit(op)}
              canRegisterInterest={this.canRegisterInterest(op)}
              isAuthenticated={this.props.isAuthenticated}
              me={this.me}
              {...this.props}
            />
            <Divider />
            {this.canEdit(op) && (
              <>
                {this.canManageInterests(op) &&
                  <>
                    <OpSectionGrid>
                      <h2>
                        <FormattedMessage
                          id='interestSection.name'
                          defaultMessage='Interested Volunteers'
                          description='label for interest table on op detail page'
                        />
                      </h2>

                      <div>
                        <InterestSection opid={op._id} />
                      </div>
                    </OpSectionGrid>

                    <Divider />
                  </>}

                <OpSectionGrid>
                  <h2>Danger zone</h2>
                  <div>
                    <h4>
                      {' '}
                      These buttons will permanantly end your activity - be
                      careful!
                    </h4>
                    <OpOwnerManageInterests
                      canManageInterests={this.canManageInterests(op)}
                      op={op}
                      confirmOpportunity={this.confirmOpportunity}
                      cancelOpportunity={this.cancelOpportunity}
                    />
                    <Button
                      id='editOpBtn'
                      style={{ marginBottom: '1rem' }}
                      type='primary'
                      shape='round'
                      onClick={() => this.setState({ editing: true })}
                    >
                      <FormattedMessage
                        id='op.edit'
                        defaultMessage='Edit'
                        description='Button to edit an opportunity'
                      />
                    </Button>
                  </div>
                </OpSectionGrid>
              </>
            )}
          </FullPage>
        )
      )
    }
  }
}

OpDetailPage.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
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

export const OpDetailPageWithOps = withMembers(withOps(OpDetailPage))
export default publicPage(withMembers(withOps(OpDetailPage)))
