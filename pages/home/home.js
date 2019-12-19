import { Button, Icon, message, Tabs } from 'antd'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import NextActionBlock from '../../components/Action/NextActionBlockV2'
import ActAdd from '../../components/Act/ActAdd'
import OpAdd from '../../components/Op/OpAdd'
import OpList from '../../components/Op/OpList'
import OpRecommendations from '../../components/Op/OpRecommendations'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import { FullPage, P, PageHeaderContainer, RequestButtonContainer } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withArchivedOpportunities, withInterests, withMembers, withOps, withPeople, withRecommendedOps } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import { InterestStatus } from '../../server/api/interest/interest.constants'
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

const OpListSubSection = ({ ops, children }) => {
  if (ops.length === 0) return ''

  return (
    <>
      <SectionTitleWrapper>
        <h2>{children}</h2>
      </SectionTitleWrapper>
      <OpList ops={ops} />
    </>)
}

class PersonHomePage extends Component {
  state = {
    editProfile: false
  }

  getArchivedOpsForRequestor (status) {
    return this.props.archivedOpportunities.data
      .filter(op => op.status === status)
  }

  getArchivedOpsForVolunteer () {
    // console.log(this.props.interestsArchived.data)
    const res = this.props.interestsArchived.data
      .filter(interest => [InterestStatus.COMMITTED, InterestStatus.ATTENDED].includes(interest.status))
      .map(interest => interest.opportunity)
    // console.log(res)
    return res
  }

  myOpsList () {
    const myops = this.props.opportunities.data // list of ops I own
    return myops
  }

  volOpsList () {
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
      const myOpportunities = {
        q: JSON.stringify({ requestor: me._id })
      }

      await Promise.all([
        store.dispatch(reduxApi.actions.tags.get()),
        store.dispatch(reduxApi.actions.opportunities.get(myOpportunities)),
        store.dispatch(reduxApi.actions.archivedOpportunities.get(myOpportunities)),
        store.dispatch(reduxApi.actions.locations.get({ withRelationships: true })),
        store.dispatch(reduxApi.actions.interests.get({ me: me._id })),
        store.dispatch(reduxApi.actions.interestsArchived.get({ me: me._id })),
        store.dispatch(reduxApi.actions.members.get({ meid: me._id })),
        store.dispatch(reduxApi.actions.recommendedOps.get({ me: me._id }))
      ])
    } catch (err) {
      console.error('error in getting ops', err)
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

    const ops = this.myOpsList()

    const vops = this.volOpsList()

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
    const historyTab = (
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
          
            <SectionWrapper>
              <NextActionBlock />
              <OpListSubSection ops={ops.filter(op => ['active', 'draft'].includes(op.status))}>
                <FormattedMessage
                  id='home.activeOpportunities'
                  defaultMessage='Active Opportunities'
                  decription='Subtitle for teacher home page for active opportunities that have been hosted'
                />
              </OpListSubSection>
              <OpListSubSection ops={vops.filter(op => ['active', 'draft'].includes(op.status))}>
                <FormattedMessage
                  id='home.myOpportunities'
                  defaultMessage='My Opportunities'
                  description='Subtitle for teacher home page for signed up opportunities by the volunteers'
                />
              </OpListSubSection>
              <SectionTitleWrapper>
                <h2>
                  <FormattedMessage
                    id='home.recommendedOpportunities'
                    defaultMessage='Recommended for You'
                    decription='Title for volunteer home page for recommended opportunities'
                  />
                  <P>
                    <FormattedMessage
                      id='home.recommendedOpportunitiesP'
                      defaultMessage='Here are some opportunities we think you might like'
                      decription='Subtitle for volunteer home page for recommended opportunities'
                    />
                  </P>
                </h2>
              </SectionTitleWrapper>
              <OpRecommendations recommendedOps={this.props.recommendedOps.data[0]} />
            </SectionWrapper>

          </TabPane>
          <TabPane tab={historyTab} key='2'>
            <SectionWrapper>

              <OpListSubSection ops={this.getArchivedOpsForRequestor('completed')}>
                <FormattedMessage
                  id='home.History.completedOpportunities'
                  defaultMessage='Completed Opportunities'
                  description='Subtitle for completed activites on home page history tab'
                />
              </OpListSubSection>
              <OpListSubSection ops={this.getArchivedOpsForRequestor('cancelled')}>
                <FormattedMessage
                  id='home.History.cancelledOpportunities'
                  defaultMessage='Cancelled Opportunities'
                  description='Subtitle for teacher cancelled activites on home page history tab'
                />
              </OpListSubSection>
              <OpListSubSection ops={this.getArchivedOpsForVolunteer()}>
                <FormattedMessage
                  id='home.History.attendedOpportunities'
                  defaultMessage='Attended Opportunities'
                  description='Subtitle for volunteer attended activites on home page history tab'
                />
              </OpListSubSection>

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
export const PersonHomePageTest = withRecommendedOps(withMembers(withInterests(
  withOps(withArchivedOpportunities(PersonHomePage))))
) // for test
export default securePage(withPeople(PersonHomePageTest))
