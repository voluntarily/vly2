import { Button, Icon, message, Tabs } from 'antd'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import GoalSection from '../../components/Goal/GoalSection'
import ActAdd from '../../components/Act/ActAdd'
import OpAdd from '../../components/Op/OpAdd'
import OpList from '../../components/Op/OpList'
import OpRecommendations from '../../components/Op/OpRecommendations'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import { FullPage, P, PageHeaderContainer, RequestButtonContainer } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withHomeData, withPeople } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'

const { TabPane } = Tabs

const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`
const SectionWrapper = styled.div`
  margin: 4rem 0 6rem 0;
`

const TitleContainer = styled.div`
text-transform: capitalize;
`

function callback (key) {
  // TODO: [VP-300] on tab change update the path so that the page is bookmark and reloadable
}

class PersonHomePage extends Component {
  state = {
    editProfile: false
  }

  constructor (props) {
    super(props)
    this.getArchivedOpportunitiesByStatus = this.getArchivedOpportunitiesByStatus.bind(
      this
    )
  }

  getArchivedOpportunitiesByStatus (status) {
    return this.props.archivedOpportunities.data.filter(
      op => op.status === status && op.requestor === this.props.me._id
    )
  }

  interestedOps () {
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
    const ops = [...volops]
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
        store.dispatch(reduxApi.actions.tags.get()),
        store.dispatch(reduxApi.actions.opportunities.get(filters)),
        store.dispatch(reduxApi.actions.locations.get({ withRelationships: true })),
        store.dispatch(reduxApi.actions.interests.get({ me: me._id })),
        store.dispatch(reduxApi.actions.personalGoals.get({ meid: me._id })),
        store.dispatch(reduxApi.actions.members.get({ meid: me._id })),
        store.dispatch(
          reduxApi.actions.archivedOpportunities.get({ requestor: me._id })
        ),
        store.dispatch(reduxApi.actions.recommendedOps.get({ me: me._id }))
      ])
    } catch (err) {
      console.error('error in getting home page data', err)
    }
  }

  handleCancel = () => {
    this.setState({ editProfile: false })
  }

  handleUpdate = async () => {
    const person = this.props.me
    const role = this.sortRoleByPower(person)
    const personData = { ...person, role }
    await this.props.dispatch(
      reduxApi.actions.people.put(
        { id: personData._id },
        { body: JSON.stringify(personData) }
      )
    )
    message.success('Saved.')
    // go to details page
    this.setState({ editProfile: false })
  }

  sortRoleByPower = ({ role }) => {
    if (role.includes('admin')) {
      role = role.filter(element => { return element !== 'admin' })
      role.push('admin')
    }
    return role
  }

  render () {
    const shadowStyle = { overflow: 'visible' }
    if (this.props.members.sync && this.props.members.data.length > 0) {
      this.props.me.orgMembership = this.props.members.data.filter(m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status))
      this.props.me.orgFollowership = this.props.members.data.filter(m => m.status === MemberStatus.FOLLOWER)
    }

    const ops = this.props.opportunities.data // list of ops I own
    const vops = this.interestedOps()
    // console.log(this.props.personalGoals.data)
    // create inverted list of goals with the pg as a child.
    // this lets us use the same goal cards
    const personalGoals = this.props.personalGoals.data.map(pg => {
      return ({
        ...pg.goal,
        personalGoal: pg,
        status: pg.status
      })
    })
    // console.log(personalGoals)
    const opsTab = (
      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        <Icon type='inbox' />
        <FormattedMessage
          id='home.liveops'
          defaultMessage='Active'
          description='show opportunities list on volunteer home page'
        />
      </span>
    )
    const searchTab = (
      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        <Icon type='history' />
        <FormattedMessage
          id='home.pastops'
          defaultMessage='History'
          description='show volunteering history on volunteer home page'
        />
      </span>
    )
    const profileTab = (
      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
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
        <Helmet>
          <title>Voluntarily - Dashboard</title>
        </Helmet>
        <PageHeaderContainer>
          <TitleContainer>
            <h1>
              {this.props.me.nickname}'s Requests
            </h1>
          </TitleContainer>
          <RequestButtonContainer>
            <OpAdd {...this.props} />
            <ActAdd {...this.props} />
          </RequestButtonContainer>
          <h5>See the requests you have signed up for here</h5>
        </PageHeaderContainer>

        <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
          <TabPane tab={opsTab} key='1'>
            {!!personalGoals.length &&
              <SectionWrapper>
                <GoalSection goals={personalGoals} />
              </SectionWrapper>}
            {
              this.props.opportunities.data.length !== 0 && (
                <SectionWrapper>
                  <SectionTitleWrapper>
                    <h2>
                      <FormattedMessage
                        id='home.liveOpportunities'
                        defaultMessage='Active Opportunities'
                        decription='subtitle on teacher home page for active opportunities that have been hosted'
                      />
                    </h2>
                  </SectionTitleWrapper>
                  {ops && (
                    <OpList
                      ops={ops.filter(op =>
                        ['active', 'draft'].includes(op.status)
                      )}
                    />
                  )}
                  <SectionTitleWrapper>
                    <h2>
                      <FormattedMessage
                        id='home.myOpportunities'
                        defaultMessage='My Opportunities'
                        decription='subtitle on teacher home page for signed up opportunities by the volunteers'
                      />
                    </h2>
                  </SectionTitleWrapper>
                  {ops && (
                    <OpList
                      id='MyOpportunities'
                      ops={vops.filter(op =>
                        ['active', 'draft'].includes(op.status)
                      )}
                    />
                  )}
                </SectionWrapper>
              )
            }

            {this.props.recommendedOps.data.length !== 0 &&
              <SectionWrapper>
                <SectionTitleWrapper>
                  <h2>
                    <FormattedMessage
                      id='home.recommendedOpportunities'
                      defaultMessage='Recommended for You'
                      decription='Title on volunteer home page for recommended opportunities'
                    />
                    <P>
                      <FormattedMessage
                        id='home.recommendedOpportunitiesP'
                        defaultMessage='Here are some opportunities we think you might like'
                        decription='Subtitle on volunteer home page for recommended opportunities'
                      />
                    </P>
                  </h2>
                </SectionTitleWrapper>
                <OpRecommendations
                  recommendedOps={this.props.recommendedOps.data[0]}
                />
              </SectionWrapper>}
          </TabPane>
          <TabPane tab={searchTab} key='2'>
            <SectionWrapper>
              <SectionTitleWrapper>
                <h2>Completed Requests</h2>
              </SectionTitleWrapper>
              <OpList
                ops={this.getArchivedOpportunitiesByStatus('completed')}
              />
              <SectionTitleWrapper>
                <h2>Cancelled Requests</h2>
              </SectionTitleWrapper>
              <OpList
                ops={this.getArchivedOpportunitiesByStatus('cancelled')}
              />
            </SectionWrapper>
          </TabPane>
          <TabPane tab={profileTab} key='3'>
            <SectionWrapper>
              {this.state.editProfile ? (
                <PersonDetailForm
                  person={this.props.me}
                  existingTags={this.props.tags.data}
                  locations={this.props.locations.data[0].locations}
                  onSubmit={this.handleUpdate}
                  onCancel={this.handleCancel}
                />
              ) : (
                <div>
                  <Button
                    style={{ float: 'right' }}
                    type='secondary'
                    shape='round'
                    onClick={() => this.setState({ editProfile: true })}
                  >
                    <FormattedMessage
                      id='editPerson'
                      defaultMessage='Edit'
                      description='Button to edit an person on PersonDetails page'
                    />
                  </Button>
                  <PersonDetail person={this.props.me} />
                </div>
              )}
            </SectionWrapper>
          </TabPane>
        </Tabs>
      </FullPage>
    )
  }
}
export const PersonHomePageTest = withHomeData(PersonHomePage)

export default securePage(withPeople(PersonHomePageTest))
