import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Icon, message, Tabs } from 'antd'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import OpList from '../../components/Op/OpList'
import OpAdd from '../../components/Op/OpAdd'
import { TextHeadingBlack, SpacerSmall } from '../../components/VTheme/VTheme'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import reduxApi, { withInterests, withPeople, withOps } from '../../lib/redux/reduxApi.js'
const { TabPane } = Tabs

function callback (key) {
  console.log(key)
}

class PersonHomePage extends Component {
  state = {
    editProfile: false
  }

  mergeOpsList () {
    const myops = this.props.opportunities.data // list of ops I own
    const interests = this.props.interests.data // list of ops I'm volunteering for
    const volops = interests.map((interest, index) => {
      interest.opportunity.interest = { _id: interest._id, status: interest.status, comment: interest.comment }
      return interest.opportunity
    })
    const ops = [ ...volops, ...myops ]
    return ops
  }

  static async getInitialProps ({ store }) {
    try {
      const me = store.getState().session.me
      const requestor = { requestor: me._id }
      const filters = {
        q: JSON.stringify(requestor)
        // s: date
      }

      await Promise.all([
        store.dispatch(reduxApi.actions.opportunities.get(filters)),
        store.dispatch(reduxApi.actions.interests.get({ me: me._id }))
      ])
    } catch (err) {
      console.log('error in getting ops', err)
    }
  }

  handleCancel = () => {
    this.setState({ editProfile: false })
  }

  async handleUpdate (person) {
    if (!person) return
    // Actual data request
    let res = {}
    res = await this.props.dispatch(reduxApi.actions.people.put({ id: person._id }, { body: JSON.stringify(person) }))

    person = res[0]
    message.success('Saved.')
    // go  to details page
    this.setState({ editProfile: false })
  }

  render () {
    const ops = this.mergeOpsList()
    const opsTab = <span><Icon type='schedule' /><FormattedMessage id='home.liveops' defaultMessage='Active' description='show opportunities list on volunteer home page' /></span>
    const searchTab = <span><Icon type='appstore' /><FormattedMessage id='home.pastops' defaultMessage='History' description='show volunteering history on volunteer home page' /></span>
    const profileTab = <span><Icon type='setting' /><FormattedMessage id='home.profile' defaultMessage='Profile' description='show profile on volunteer home page' /></span>
    const opAddButton = <OpAdd {...this.props} />
    return (
      <FullPage>
        <TextHeadingBlack>
          {this.props.me.nickname}
          {/* <FormattedMessage
            id='home.title'
            defaultMessage='My Stuff'
            description='title on volunteer home page.'
          /> */}
        </TextHeadingBlack>
        <SpacerSmall />
        <Tabs defaultActiveKey='1' onChange={callback} tabBarExtraContent={opAddButton} >
          <TabPane tab={opsTab} key='1'>
            <h2>
              <FormattedMessage
                id='home.liveOpportunities'
                defaultMessage='Active Requests'
                decription='subtitle on volunteer home page for active requests and opportunities'
              />
            </h2>
            {ops &&
              <OpList
                ops={ops.filter(op => ['active', 'draft'].includes(op.status))}
              />
            }
            {/* // TODO: [VP-208] list of things volunteers can do on home page */}
            <h2>More things you can do</h2>
            <ul>
              <li>Suggested for you</li>
              <li>Get verified</li>
              <li>Training</li>
              <li>Create an activity</li>
              <li>create an offer</li>
            </ul>
          </TabPane>
          <TabPane tab={searchTab} key='2'>
            <h2>
              <FormattedMessage
                id='home.pastOpportunities'
                defaultMessage='Completed Requests'
                decription='subtitle on volunteer home page for completed requests and opportunities'
              />
            </h2>
            <OpList ops={ops.filter(op => op.status === 'done' && op.requestor === this.props.me._id)} />
            {/* <OpListSection query={myPastfilterString} /> */}
          </TabPane>
          <TabPane tab={profileTab} key='3'>
            {this.state.editProfile
              ? <PersonDetailForm person={this.props.me} onSubmit={this.handleUpdate.bind(this, this.props.me)} onCancel={this.handleCancel} />
              : <div>
                <Button style={{ float: 'right' }} type='primary' shape='round' onClick={() => this.setState({ editProfile: true })} >
                  <FormattedMessage id='editPerson' defaultMessage='Edit' description='Button to edit an person on PersonDetails page' />
                </Button>
                <PersonDetail person={this.props.me} />

              </div>
            }
          </TabPane>
        </Tabs>

      </FullPage>
    )
  }
}
export const PersonHomePageTest = withInterests(withOps(PersonHomePage)) // for test
export default securePage(withPeople(PersonHomePageTest))
