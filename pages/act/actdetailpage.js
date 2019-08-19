import { Button, Divider, message } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import Loading from '../../components/Loading'
import ActDetail from '../../components/Act/ActDetail'
import ActDetailForm from '../../components/Act/ActDetailForm'
import PersonCard from '../../components/Person/PersonCard'
import publicPage, { FullPage } from '../../hocs/publicPage'
import reduxApi, { withActs } from '../../lib/redux/reduxApi.js'
import { Role } from '../../server/services/authorize/role'
import { Helmet } from 'react-helmet'

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
    await store.dispatch(reduxApi.actions.tags.get())

    // Get one Act
    const isNew = query && query.new && query.new === 'new'
    if (isNew) {
      // console.log('opdetailpage: getInitialProps', isNew)
      return {
        isNew: true,
        actid: null
      }
    } else if (query && query.id) {
      await store.dispatch(reduxApi.actions.activities.get(query))
      return {
        isNew: false,
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
    let isOwner = false
    let content
    let act
    let owner
    if (this.props.isNew) {
      act = blankAct
      owner = me
      isOwner = true
    } else if (this.props.activities.loading) {
      content = <Loading><p>Loading details...</p></Loading>
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
        // console.log('length', acts.length)
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
        isOP && <div>
          <Button>TODO: Create Opportunity</Button>
          <Divider />
        </div>
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
          { canEdit && <Button id='editActBtn' style={{ float: 'right' }} type='primary' shape='round' onClick={() => this.setState({ editing: true })} >
            <FormattedMessage id='act.edit' defaultMessage='Edit' description='Button to edit an activity' />
          </Button>}

          <ActDetail act={act} />
          {ownerInfo()}
          <Divider />
          {createOpportunitySection()}
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
export const ActDetailPageWithActs = withActs(ActDetailPage)
export default publicPage(withActs(ActDetailPage))
