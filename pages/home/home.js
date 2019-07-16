import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Icon, message, Tabs } from 'antd'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import OpList from '../../components/Op/OpList'
import OpAdd from '../../components/Op/OpAdd'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import reduxApi, {
  withInterests,
  withPeople,
  withOps,
  withArchivedOpportunitys
} from '../../lib/redux/reduxApi.js'
import NextActionBlock from '../../components/Action/NextActionBlock'
import styled from 'styled-components'

import { TextHeadingBlack, TextP } from '../../components/VTheme/VTheme'

const { TabPane } = Tabs

const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`
const SectionWrapper = styled.div`
  margin: 4rem 0 6rem 0;
`

const TitleContainer = styled.div``

const PageHeaderContainer = styled.div`
  margin: 8rem 0 2rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 767px) {
    margin-top: 4rem;
    grid-template-columns: calc(100vw - 2rem);
    grid-gap: 0rem;
  }
`

const RequestButtonContainer = styled.div`
  justify-self: end;
  @media screen and (max-width: 767px) {
    margin-top: 1rem;
    justify-self: start;
  }
`

function callback (key) {
  // TODO: [VP-300] on tab change update the path so that the page is bookmark and reloadable
  // console.log(key)
}

class PersonHomePage extends Component {
  state = {
    editProfile: false
  }

  constructor (props) {
    super(props)
    this.getArchivedOpportunityByStatus = this.getArchivedOpportunityByStatus.bind(this)
  }

  getArchivedOpportunityByStatus (status) {
    return this.props.archivedOpportunitys.data.filter(
      op => op.status === status && op.requestor === this.props.me._id
    )
  }

  mergeOpsList () {
    const myops = this.props.opportunities.data // list of ops I own
    const interests = this.props.interests.data // list of ops I'm volunteering for
    const volops = interests
      .map((interest, index) => {
        if (!interest.opportunity || typeof interest.opportunity === 'string') {
          return null
        } else {
          interest.opportunity.interest = {
            _id: interest._id,
            status: interest.status,
            comment: interest.comment
          }
          return interest.opportunity
        }
      })
      .filter(op => op)
    const ops = [...volops, ...myops]
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
        store.dispatch(reduxApi.actions.interests.get({ me: me._id })),
        store.dispatch(reduxApi.actions.archivedOpportunitys.get({ requestor: me._id }))
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
    res = await this.props.dispatch(
      reduxApi.actions.people.put(
        { id: person._id },
        { body: JSON.stringify(person) }
      )
    )

    person = res[0]
    message.success('Saved.')
    // go  to details page
    this.setState({ editProfile: false })
  }

  render () {
    var shadowStyle = { overflow: 'visible' }
    const ops = this.mergeOpsList()
    const opsTab = (
      <span>
        <Icon type='schedule' />
        <FormattedMessage
          id='home.liveops'
          defaultMessage='Active'
          description='show opportunities list on volunteer home page'
        />
      </span>
    )
    const searchTab = (
      <span>
        <Icon type='appstore' />
        <FormattedMessage
          id='home.pastops'
          defaultMessage='History'
          description='show volunteering history on volunteer home page'
        />
      </span>
    )
    const profileTab = (
      <span>
        <Icon type='setting' />
        <FormattedMessage
          id='home.profile'
          defaultMessage='Profile'
          description='show profile on volunteer home page'
        />
      </span>
    )

    return (
      <FullPage>
        <PageHeaderContainer>
          <TitleContainer>
            <TextHeadingBlack>
              {this.props.me.nickname}
              {/* <FormattedMessage
            id='home.title'
            defaultMessage='My Stuff'
            description='title on volunteer home page.'
          /> */}
            </TextHeadingBlack>
          </TitleContainer>
          <RequestButtonContainer>
            <OpAdd {...this.props} />
          </RequestButtonContainer>
        </PageHeaderContainer>

        <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
          <TabPane tab={opsTab} key='1'>
            <SectionWrapper>
              <SectionTitleWrapper>
                <TextHeadingBlack>
                  <FormattedMessage
                    id='home.liveOpportunities'
                    defaultMessage='Active Requests'
                    decription='subtitle on volunteer home page for active requests and opportunities'
                  />
                </TextHeadingBlack>
              </SectionTitleWrapper>
              {ops && (
                <OpList
                  ops={ops.filter(op =>
                    ['active', 'draft'].includes(op.status)
                  )}
                />
              )}
            </SectionWrapper>

            <SectionWrapper>
              <SectionTitleWrapper>
                <TextHeadingBlack>Getting Started</TextHeadingBlack>
                <TextP>
                  To start volunteering on Voluntarily, here are a few things we
                  recommend doing:
                </TextP>
              </SectionTitleWrapper>
              {/* // TODO: [VP-208] list of things volunteers can do on home page */}
              <NextActionBlock />
            </SectionWrapper>
          </TabPane>
          <TabPane tab={searchTab} key='2'>
            <SectionWrapper>
              <SectionTitleWrapper>
                <TextHeadingBlack>Completed Requests</TextHeadingBlack>
              </SectionTitleWrapper>
              <OpList
                ops={this.getArchivedOpportunityByStatus('completed')}
              />
              <SectionTitleWrapper>
                <TextHeadingBlack>Cancelled Requests</TextHeadingBlack>
              </SectionTitleWrapper>
              <OpList
                ops={this.getArchivedOpportunityByStatus('cancelled')}
              />
            </SectionWrapper>
            {/* <OpListSection query={myPastfilterString} /> */}
          </TabPane>
          <TabPane tab={profileTab} key='3'>
            {this.state.editProfile ? (
              <PersonDetailForm
                person={this.props.me}
                onSubmit={this.handleUpdate.bind(this, this.props.me)}
                onCancel={this.handleCancel}
              />
            ) : (
              <div>
                <PersonDetail person={this.props.me} />
                <Button
                  style={{ float: 'right' }}
                  type='primary'
                  shape='round'
                  onClick={() => this.setState({ editProfile: true })}
                >
                  <FormattedMessage
                    id='editPerson'
                    defaultMessage='Edit'
                    description='Button to edit an person on PersonDetails page'
                  />
                </Button>
              </div>
            )}
          </TabPane>
        </Tabs>
      </FullPage>
    )
  }
}
export const PersonHomePageTest = withInterests(withOps(withArchivedOpportunitys(PersonHomePage))) // for test
export default securePage(withPeople(PersonHomePageTest))
