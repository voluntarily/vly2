import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Icon, message, Tabs } from 'antd'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import OpList from '../../components/Op/OpList'
import TitleSectionSub from '../../components/LandingPageComponents/TitleSectionSub'
import { TextHeadingBlack, SpacerSmall } from '../../components/VTheme/VTheme'
import FeaturedTwoSection from '../../components/LandingPageComponents/FeaturedTwoSection'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import reduxApi, { withPeople, withOps } from '../../lib/redux/reduxApi.js'
const { TabPane } = Tabs

function callback (key) {
  console.log(key)
}

class PersonHomePage extends Component {
  state = {
    editProfile: false
  }

  static async getInitialProps ({ store }) {
    try {
      // TODO: [VP-214] get only ops that invove the current user either as requestor, or volunteer
      await store.dispatch(reduxApi.actions.opportunities.get())
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
    const ops = this.props.opportunities.data
    const opsTab = <span><Icon type='schedule' /><FormattedMessage id='home.liveops' defaultMessage='Active' description='show opportunities list on volunteer home page' /></span>
    const searchTab = <span><Icon type='appstore' /><FormattedMessage id='home.pastops' defaultMessage='History' description='show volunteering history on volunteer home page' /></span>
    const profileTab = <span><Icon type='setting' /><FormattedMessage id='home.profile' defaultMessage='Profile' description='show profile on volunteer home page' /></span>
    // const myPastfilterString = '{"status":"done","requestor":"' + this.props.me._id + '"}'
    return (
      <FullPage>
        <TextHeadingBlack>
          <FormattedMessage
            id='home.title'
            defaultMessage='My Stuff'
            description='title on volunteer home page.'
          />
        </TextHeadingBlack>
        <SpacerSmall />
        <Tabs defaultActiveKey='1' onChange={callback}>
          <TabPane tab={opsTab} key='1'>
            <FeaturedTwoSection
              title='Active Requests'
              subtitle='These events are happening soon'
              ops={ops.filter(op => ['active', 'draft'].includes(op.status) && op.requestor === this.props.me._id)}
            />
            {/* // TODO: [VP-208] list of things volunteers can do on home page */}
            <h1>More things you can do</h1>
            <ul>
              <li>Suggested for you</li>
              <li>Get verified</li>
              <li>Training</li>
              <li>Create an activity</li>
              <li>create an offer</li>
            </ul>
          </TabPane>
          <TabPane tab={searchTab} key='2'>
            <TitleSectionSub
              title='Completed Requests'
              subtitle='Completed activities'
            />
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
export const PersonHomePageTest = withOps(PersonHomePage) // for test
export default securePage(withPeople(PersonHomePageTest))
