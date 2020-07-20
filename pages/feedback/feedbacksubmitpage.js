import {
  FullPage,
  PageBannerNoTabs
} from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import reduxApi, { withFeedback } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import { useEffect } from 'react'
import Loading from '../../components/Loading'

const FeedbackSubmitPage = ({ feedbackActions }) => {
  const { query: { rating, opportunity } } = useRouter()
  const [me, members, opportunities, feedback] = useSelector(state => [state.session.me, state.members, state.archivedOpportunities, state.feedback])
  const dispatch = useDispatch()

  if (!members.sync) { return <FullPage><Loading label='members' entity={members} /></FullPage> }
  if (!opportunities.sync) { return <FullPage><Loading label='opportunities' entity={opportunities} /></FullPage> }

  // collect the orgs the person follows and is member of.
  if (members.sync && members.data.length > 0) {
    me.orgMembership = members.data.filter(m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status))
  }

  useEffect(() => {
    const feedback = {
      respondent: me._id,
      respondentOrgs: me.orgMembership.map(m => m.organisation._id),
      opportunity,
      activity: opportunities.data[0].fromActivity,
      rating
    }
    dispatch(feedbackActions.post({}, { body: JSON.stringify(feedback) }))
  }, [])

  return (
    <FullPage>
      <PageBannerNoTabs>
        <h1>
          <FormattedMessage
            id='feedbacksubmitpage.title'
            defaultMessage='Leaving Feedback'
            description='Title on feedback submit page'
          />
        </h1>

      </PageBannerNoTabs>
      {feedback.sync && <p>Your rating has been recorded.</p>}
      {feedback.error && <p>Your rating could not be recorded at this time.</p>}
    </FullPage>
  )
}

FeedbackSubmitPage.getInitialProps = async ({ store, query }) => {
  try {
    const me = store.getState().session.me
    const meid = me._id.toString()
    await store.dispatch(reduxApi.actions.members.get({ meid: meid }))
    await store.dispatch(reduxApi.actions.archivedOpportunities.get({ id: query.opportunity }))
  } catch (err) {
    console.error('error in getting feedback submit page data', err)
  }
}

export default securePage(withFeedback(FeedbackSubmitPage))
