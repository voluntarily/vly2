import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectTopicGroupButtons } from '../SignUp/SelectTopicGroup'
import callApi from '../../lib/callApi'
import reduxApi from '../../lib/redux/reduxApi'
import { Role } from '../../server/services/authorize/role'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

export const setSession = session => {
  return {
    type: 'SET_SESSION',
    ...session
  }
}

export const TopicGroupSection = ({ person }) => {
  const currentTopicGroups = {
    business: person.topicGroups.includes('business'),
    community: person.topicGroups.includes('community'),
    education: person.topicGroups.includes('education')
  }
  const [topicGroups, setTopicGroups] = useState(currentTopicGroups)
  const session = useSelector(state => state.session)
  const me = session.me
  const opType = me.role.includes(Role.VOLUNTEER) ? OFFER : ASK
  const dispatch = useDispatch()
  const updatePrefs = async prefs => {
    const res = await callApi('signUp', 'post', prefs)
    session.me = res
    dispatch(setSession(session)) // update the session
    dispatch(reduxApi.actions.people.get({ id: person._id })) // update the redux person
  }
  const handleSelectTopicGroup = async update => {
    const newtgs = { ...topicGroups, ...update }
    updatePrefs({ topicGroups: Object.keys(newtgs).filter(key => newtgs[key]) })
    setTopicGroups(newtgs) // remember this is async and updates the page
  }
  return (
    <SelectTopicGroupButtons
      type={opType}
      topicGroups={topicGroups}
      onChange={handleSelectTopicGroup}
    />
  )
}
