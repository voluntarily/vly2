import { Button, Icon, message, Tabs } from 'antd'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import NextActionBlock from '../../components/Action/NextActionBlock'
import OpAdd from '../../components/Op/OpAdd'
import OpList from '../../components/Op/OpList'
import OpRecommendations from '../../components/Op/OpRecommendations'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import { FullPage, H3Black, P, PageHeaderContainer, RequestButtonContainer } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withArchivedOpportunities, withInterests, withMembers, withOps, withPeople, withRecommendedOps } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'

const { TabPane } = Tabs

const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`
const SectionWrapper = styled.div`
  margin: 4rem 0 6rem 0;
`

const TitleContainer = styled.div``

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
    this.getArchivedOpportunitiesByStatus = this.getArchivedOpportunitiesByStatus.bind(
      this
    )
  }

  getArchivedOpportunitiesByStatus (status) {
    return this.props.archivedOpportunities.data.filter(
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

      await store.dispatch(reduxApi.actions.tags.get())

      await Promise.all([
        store.dispatch(reduxApi.actions.opportunities.get(filters)),
        store.dispatch(reduxApi.actions.locations.get({ withRelationships: true })),
        store.dispatch(reduxApi.actions.interests.get({ me: me._id })),
        store.dispatch(reduxApi.actions.members.get({ meid: me._id })),
        store.dispatch(
          reduxApi.actions.archivedOpportunities.get({ requestor: me._id })
        ),
        store.dispatch(reduxApi.actions.recommendedOps.get({ me: me._id }))
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
    if (this.props.members.sync && this.props.members.data.length > 0) {
      this.props.me.orgMembership = this.props.members.data.filter(m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status))
      this.props.me.orgFollowership = this.props.members.data.filter(m => m.status === MemberStatus.FOLLOWER)
    }

    const ops = this.mergeOpsList()

    const opsTab = (
      <span>
        <Icon type='inbox' />
        <FormattedMessage
          id='home.liveops'
          defaultMessage='Active'
          description='show opportunities list on volunteer home page'
        />
      </span>
    )
    const searchTab = (
      <span>
        <Icon type='history' />
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
        <Helmet>
          <title>Voluntarily - Dashboard</title>
        </Helmet>
        <PageHeaderContainer>
          <TitleContainer>
            <H3Black>
              {this.props.me.nickname}'s Requests
            </H3Black>
          </TitleContainer>
          <RequestButtonContainer>
            <OpAdd {...this.props} />
          </RequestButtonContainer>
          <p>See the requests you have signed up for here</p>
        </PageHeaderContainer>

        <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
          <TabPane tab={opsTab} key='1'>

            <SectionWrapper>

              {/* // TODO: [VP-208] list of things volunteers can do on home page */}
              <NextActionBlock />
            </SectionWrapper>
            {
              this.props.opportunities.data.length !== 0 && (
                <SectionWrapper>
                  <SectionTitleWrapper>
                    <H3Black>
                      <FormattedMessage
                        id='home.liveOpportunities'
                        defaultMessage='Active Requests'
                        decription='subtitle on volunteer home page for active requests and opportunities'
                      />
                    </H3Black>
                  </SectionTitleWrapper>
                  {ops && (
                    <OpList
                      ops={ops.filter(op =>
                        ['active', 'draft'].includes(op.status)
                      )}
                    />

                  )}
                </SectionWrapper>
              )
            }

            <SectionWrapper>
              <SectionTitleWrapper>
                <H3Black>
                  <FormattedMessage
                    id='home.recommendedOpportunities'
                    defaultMessage='Recommended for you'
                    decription='Title on volunteer home page for recommended opportunities'
                  />
                  <P>
                    <FormattedMessage
                      id='home.recommendedOpportunitiesP'
                      defaultMessage='Here are some opportunities we think you might like'
                      decription='Subtitle on volunteer home page for recommended opportunities'
                    />
                  </P>
                </H3Black>
              </SectionTitleWrapper>
              <OpRecommendations
                recommendedOps={this.props.recommendedOps.data[0]} />
            </SectionWrapper>

          </TabPane>
          <TabPane tab={searchTab} key='2'>
            <SectionWrapper>
              <SectionTitleWrapper>
                <H3Black>Completed Requests</H3Black>
              </SectionTitleWrapper>
              <OpList
                ops={this.getArchivedOpportunitiesByStatus('completed')}
              />
              <SectionTitleWrapper>
                <H3Black>Cancelled Requests</H3Black>
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
