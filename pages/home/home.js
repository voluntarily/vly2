import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Icon, message, Tabs } from 'antd'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import OpListSection from '../../components/Op/OpListSection'
import TitleSectionSub from '../../components/LandingPageComponents/TitleSectionSub'
import { TextHeadingBlack, SpacerSmall } from '../../components/VTheme/VTheme'
import FeaturedTwoSection from '../../components/LandingPageComponents/FeaturedTwoSection'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import reduxApi, { withPeople } from '../../lib/redux/reduxApi.js'
const { TabPane } = Tabs

function callback (key) {
  console.log(key)
}

class PersonHomePage extends Component {
  state = {
    editProfile: false
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
    const opsTab = <span><Icon type='schedule' /><FormattedMessage id='home.liveops' defaultMessage='Active' description='show opportunities list on volunteer home page' /></span>
    const searchTab = <span><Icon type='appstore' /><FormattedMessage id='home.pastops' defaultMessage='History' description='show volunteering history on volunteer home page' /></span>
    const profileTab = <span><Icon type='setting' /><FormattedMessage id='home.profile' defaultMessage='Profile' description='show profile on volunteer home page' /></span>
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
            {/* // @TODO: [VP-187] Add real data to Upcoming Events component */}
            <FeaturedTwoSection
              title='Your Upcoming Activities'
              subtitle='These activities are happening soon'
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
            {/* @TODO: [VP-188] Add past listings filter to OpListSection */}
            <TitleSectionSub
              title='Your Past Activities'
              subtitle='LOL subtitles'
            />
            <OpListSection />
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

export const PersonHomePageTest = PersonHomePage // for test
export default securePage(withPeople(PersonHomePage))
