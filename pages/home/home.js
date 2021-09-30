import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import { HomeBanner } from '../../components/Home/HomeBanner.js'
import { HomeTabs } from '../../components/Home/HomeTabs.js'
import Loading from '../../components/Loading.js'
import { FullPage } from '../../components/VTheme/VTheme.js'
import reduxApi from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants.js'
import { reduxWrapper } from '../../lib/redux/store.js'

export const PersonHomePage = () => {
  const [me, members, opportunities, interests] = useSelector(
    state => [state.session.me, state.members, state.opportunities.data, state.interests.data]
  )
  const router = useRouter()
  const activityCount = opportunities.length + interests.length
  const [tab, setTab] = useState(
    (router.query && router.query.tab) ||
    (activityCount ? 'active' : 'discover')
  )

  const updateTab = (key, top) => {
    setTab(key)
    if (top) window.scrollTo(0, 0)
    //  else { window.scrollTo(0, 400) }
    const newpath = `/home?tab=${key}`
    router.replace(router.pathname, newpath, { shallow: true })
  }
  const handleTabChange = (key, e) => {
    updateTab(key, true)
  }

  // if (!people.sync) { return <FullPage><Loading label='people' entity={people} /></FullPage> }
  // if (!members.sync) { return <FullPage><Loading label='members' entity={members} /></FullPage> }

  // const person = people.data[0]

  // collect the orgs the person follows and is member of.
  if (members.sync && members.data.length > 0) {
    me.orgMembership = members.data.filter(m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status))
    me.orgFollowership = members.data.filter(m => m.status === MemberStatus.FOLLOWER)
  }

  return (
    <FullPage>
      <Helmet>
        <title>{me.nickname} - Voluntarily</title>
      </Helmet>
      <HomeBanner person={me} />
      <HomeTabs
        person={me}
        defaultTab={tab}
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

export const getServerSideProps = reduxWrapper.getServerSideProps(store =>
  async () => {
    try {
      console.log('PersonHomePage.getServerSideProps')
      console.log(store ? 'I have a store' : 'I dont have a store ')
      const me = store.getState().session.me
      const meid = me._id.toString()
      const myOpportunities = {
        q: JSON.stringify({ requestor: meid })
      }

      await allSettled([
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
    return {}
  })

export default PersonHomePage
// export default PersonHomePage
