import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { HomeBanner } from '../../components/Home/HomeBanner.js'
import { HomeTabs } from '../../components/Home/HomeTabs.js'
import Loading from '../../components/Loading'
import { FullPage } from '../../components/VTheme/VTheme'
import reduxApi from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import { useSelector } from 'react-redux'
import { reduxWrapper } from '../../lib/redux/store'

export const PersonHomePage = () => {
  const [me, members, opportunities, interests] = useSelector(
    state => [state.session.me, state.members, state.opportunities.data, state.interests.data]
  )
  const { asPath, query, pathname, replace } = useRouter()

  const activityCount = opportunities.length + interests.length
  const [tab, setTab] = useState(
    (query && query.tab) ||
    (activityCount ? 'active' : 'discover')
  )
  useEffect(() => {
    const qtab = asPath.match(/.*tab=(.*)/)
    qtab && setTab(qtab[1])
  }, [query])

  const updateTab = (key, top) => {
    if (top) window.scrollTo(0, 0)
    const newpath = `/home?tab=${key}`
    replace(pathname, newpath, { shallow: true })
  }
  const handleTabChange = (key, e) => {
    updateTab(key, true)
  }

  // if (!people.sync) { return <FullPage>Loading  <Loading label='people' entity={people} /></FullPage> }
  // if (!members.sync) { return <FullPage><Loading label='members' entity={members} /></FullPage> }

  // collect the orgs the person follows and is member of.
  if (members.sync && members.data.length > 0) {
    me.orgMembership = members.data.filter(m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status))
    me.orgFollowership = members.data.filter(m => m.status === MemberStatus.FOLLOWER)
  }
  // don't use me as the source of information, get the real person api call and use that.
  // 'me' should be a cut down version of the person details.
  return (
    <FullPage>
      <Head>
        <title>{me.nickname} - Voluntarily</title>
      </Head>
      <HomeBanner person={me} />
      <HomeTabs
        person={me}
        tab={tab}
        onChange={handleTabChange}
      />
    </FullPage>
  )
}
const allSettled = (promises) => {
  return Promise.all(promises.map(p => Promise.resolve(p).then(value => ({
    state: 'fulfilled',
    value
  }), reason => ({
    state: 'rejected',
    reason
  }))))
}
/** TODO: [VP-1890] when edit completes the person is updated but the session me is not.
  This leaves the page out of date until fully refreshed
*/
export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async () => {
    // console.log('PersonHomePage.getServerSideProps')
    try {
      const me = store.getState().session.me
      // TODO: bug when flow/postSignUp completes me is not set with _id and the GSSP fails. leaving the page mostly blank

      const meid = me?._id?.toString()
      if (!meid) return
      const myOpportunities = {
        q: JSON.stringify({ requestor: meid })
      }

      await allSettled([
        // store.dispatch(reduxApi.actions.people.get({ id: meid })),
        store.dispatch(reduxApi.actions.opportunities.get(myOpportunities)),
        store.dispatch(reduxApi.actions.archivedOpportunities.get(myOpportunities)),
        store.dispatch(reduxApi.actions.interests.get({ me: meid })),
        store.dispatch(reduxApi.actions.personalGoals.get({ meid: meid })),
        store.dispatch(reduxApi.actions.members.get({ meid: meid })),
        store.dispatch(reduxApi.actions.interestArchives.get({ me: meid })),
        store.dispatch(reduxApi.actions.recommendedOps.get({ me: meid }))
      ])
    } catch (err) {
      console.error('error in getting home page data', err)
    }
    // return {}
  })

export default PersonHomePage
// export default PersonHomePage
