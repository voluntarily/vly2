import { Button, message } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import ActDetail from '../../components/Act/ActDetail'
import ActDetailForm from '../../components/Act/ActDetailForm'
import Loading from '../../components/Loading'
import PersonCard from '../../components/Person/PersonCard'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withActs, withMembers } from '../../lib/redux/reduxApi.js'
import { Role } from '../../server/services/authorize/role'
import { MemberStatus } from '../../server/api/member/member.constants'

const blankAct = {
  title: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  description: '',
  status: 'draft',
  tags: []
}
export class ActDetailPage extends Component {
  state = {
    editing: false,
    text: ''
  }

  static async getInitialProps ({ store, query }) {
    const me = store.getState().session.me
    const isNew = query && query.new && query.new === 'new'
    const actExists = !!(query && query.id) // !! converts to a boolean value
    await Promise.all([
      store.dispatch(reduxApi.actions.members.get({ meid: me._id })),
      store.dispatch(reduxApi.actions.tags.get())
    ])

    if (isNew) {
      return {
        isNew,
        actid: null
      }
    } else {
      if (actExists) {
        query.session = store.getState().session //  Inject session with query that restricted api access
        await store.dispatch(reduxApi.actions.activities.get(query))
      }
      return {
        isNew,
        actExists,
        actid: query.id
      }
    }
  }

  componentDidMount () {
    if (this.props.isNew) {
      this.setState({ editing: true })
    }
  }

  handleCancelEdit = () => {
    this.setState({ editing: false })
    if (this.props.isNew) { // return to previous
      Router.back()
    }
  }

  // Called when the user confirms they want to delete an act
  async handleDelete (act) {
    if (!act) return
    // Actual data request
    await this.props.dispatch(reduxApi.actions.activities.delete({ id: act._id }))
    // TODO error handling - how can this fail?
    message.success('Deleted. ')
    Router.replace(`/acts`)
  }

  async handleSubmit (act) {
    if (!act) return
    // Actual data request
    let res = {}
    if (act._id) {
      res = await this.props.dispatch(reduxApi.actions.activities.put({ id: act._id }, { body: JSON.stringify(act) }))
    } else {
      res = await this.props.dispatch(reduxApi.actions.activities.post({}, { body: JSON.stringify(act) }))
      act = res[0]
      Router.replace(`/acts/${act._id}`)
    }
    this.setState({ editing: false })
    message.success('Saved.')
  }

  handleDeleteCancel = () => { message.error('Delete Cancelled') }

  render () {
    const me = this.props.me
    const isOrgAdmin = false // TODO: is this person an admin for the org that person belongs to.
    const isAdmin = (me && me.role.includes(Role.ADMIN))
    const isOP = (me && me.role.includes(Role.OPPORTUNITY_PROVIDER))

    // get membership list for owner
    if (me &&
        this.props.members.sync &&
        this.props.members.data.length > 0 &&
        this.props.members) {
      me.orgMembership = this.props.members.data.filter(
        m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status) &&
          m.organisation.category.includes('ap')
      )
    }

    let isOwner = false
    let content
    let act
    let owner
    if (this.props.isNew) {
      act = blankAct
      owner = me
      isOwner = true
      // set init offerOrg to first membership result
      if (me.orgMembership && me.orgMembership.length > 0) {
        act.offerOrg = {
          _id: me.orgMembership[0].organisation._id
        }
      }
    } else if (this.props.activities.loading) {
      content = <Loading />
    } else {
      const acts = this.props.activities.data
      if (acts.length === 1) {
        act = {
          ...acts[0]
          // TODO: tags: this.props.activities.data[0].tags.map(act => act.tag),
        }
        owner = act.owner
        isOwner = ((me || {})._id === (owner || {})._id)
      } else { // array must be empty
        content = <h2><FormattedMessage id='act.notavailable' defaultMessage='Sorry, this activitiy is not available' description='message on activity not found page' /></h2>
      }
    }

    // display permissions
    const canEdit = (isOwner || isOrgAdmin || isAdmin)
    const existingTags = this.props.tags.data

    const ownerInfo = () => {
      // TODO: should this be owner individual or Activity Provider Org
      return owner &&
        <div>
          <h2>
            <FormattedMessage id='act.ownerInfo' defaultMessage='Created by' description='Title for activity creator card on activity page' />
          </h2>
          <PersonCard style={{ width: '300px' }} person={owner} />
        </div>
    }

    // button to make an opportunity from an activity
    const createOpportunitySection = () => {
      return (
        // if not signed in then the interested button signs in first
        isOP &&
          <Button style={{ float: 'right' }} type='primary' shape='round' href={`/op/new?act=${act._id}`} >
            <FormattedMessage id='act.createOpportunityBtn'
              defaultMessage='Create new request from this Activity'
              description='Button to create an opportunity from an activity' />
          </Button>
      )
    }

    if (!content) {
      if (act && this.state.editing) {
        content = <div>
          <ActDetailForm
            act={act}
            me={me}
            onSubmit={this.handleSubmit.bind(this, act)}
            onCancel={this.handleCancelEdit.bind(this)}
            existingTags={existingTags}
          />
        </div>
      } else {
        content = <div>
          {createOpportunitySection()}
          { canEdit && <Button id='editActBtn' style={{ float: 'right' }} type='primary' shape='round' onClick={() => this.setState({ editing: true })} >
            <FormattedMessage id='act.edit' defaultMessage='Edit' description='Button to edit an activity' />
          </Button>}
          <ActDetail act={act} />
          {ownerInfo()}
        </div>
      }
    }

    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Activity Detail</title>
        </Helmet>
        {content}
      </FullPage>
    )
  }
}

ActDetailPage.propTypes = {
  act: PropTypes.shape({
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
export const ActDetailPageWithActs = withMembers(withActs(ActDetailPage))
export default publicPage(withMembers(withActs(ActDetailPage)))
