// import { message } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ActAdd from '../../components/Act/ActAdd'
import { HomeBanner } from '../../components/Home/HomeBanner.js'
import { HomeTabs } from '../../components/Home/HomeTabs.js'
import Loading from '../../components/Loading'
import { OpAddNewBtn } from '../../components/Op/OpAdd'
import { FullPage, PageBannerButtons } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi from '../../lib/redux/reduxApi.js'
import { MemberStatus } from '../../server/api/member/member.constants'
import { useSelector } from 'react-redux'

export const PersonHomePage = () => {
  const [people, members] = useSelector(
    state => [state.people, state.members]
  )
  const router = useRouter()
  const [tab, setTab] = useState((router.query && router.query.tab) || 'active')

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

  if (!people.sync) { return <FullPage><Loading label='people' entity={people} /></FullPage> }
  if (!members.sync) { return <FullPage><Loading label='members' entity={members} /></FullPage> }

  const person = people.data[0]

  // collect the orgs the person follows and is member of.
  if (members.sync && members.data.length > 0) {
    person.orgMembership = members.data.filter(m => [MemberStatus.MEMBER, MemberStatus.ORGADMIN].includes(m.status))
    person.orgFollowership = members.data.filter(m => m.status === MemberStatus.FOLLOWER)
  }

  return (
    <FullPage>
      <Helmet>
        <title>{person.nickname} - Voluntarily</title>
      </Helmet>
      <HomeBanner person={person}>
        <PageBannerButtons>
          <OpAddNewBtn />
        </PageBannerButtons>
        <PageBannerButtons>
          <ActAdd roles={person.roles} />
        </PageBannerButtons>
      </HomeBanner>
      <HomeTabs
        person={person}
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
PersonHomePage.getInitialProps = async ({ store, query }) => {
  try {
    const me = store.getState().session.me
    const meid = me._id.toString()
    const myOpportunities = {
      q: JSON.stringify({ requestor: meid })
    }

    await allSettled([
      store.dispatch(reduxApi.actions.people.get({ id: meid })),
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
}

export default securePage(PersonHomePage)
