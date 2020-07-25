import {
  FullPage,
  PageBannerNoTabs
} from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import reduxApi, { withFeedback } from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import { useEffect } from 'react'
import Loading from '../../components/Loading'
import Link from 'next/link'
import { Button, Typography } from 'antd'
import { FormattedMessage } from 'react-intl'

export const FeedbackSubmitPage = ({ feedbackActions }) => {
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

  const op = opportunities.data[0]

  return (
    <FullPage>
      <PageBannerNoTabs>
        <h1>
          Thanks for leaving feedback 🥳
        </h1>

      </PageBannerNoTabs>
      {feedback.sync && <p>Your rating has been recorded for opportunity: <Link href={`/archivedops/${op._id}`}><a>{op.name}</a></Link>.</p>}
      {feedback.error && <Typography.Paragraph type='danger'>Your rating could not be recorded at this time.</Typography.Paragraph>}
      {!['1', '2', '3', '4', '5'].includes(rating) && <Typography.Paragraph type='danger'>Please enter a rating between 1 and 5.</Typography.Paragraph>}

      <p>
        <FormattedMessage
          id='feedbacksubmitpage.text.recommended'
          defaultMessage='Want to do more? Check out the recommendations button for other activities still needing volunteers.'
        />

      </p>
      <Link href='/home'>
        <Button shape='round' size='large' type='primary'>
          <FormattedMessage
            id='feedbacksubmitpage.button.recommended'
            defaultMessage='Recommendations'
          />
        </Button>
      </Link>

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
