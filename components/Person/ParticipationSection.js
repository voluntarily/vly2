import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChooseParticipationButtons } from '../../components/SignUp/ChooseParticipation'
import callApi from '../../lib/callApi'
import reduxApi from '../../lib/redux/reduxApi'
import { Role } from '../../server/services/authorize/role'

export const setSession = session => {
  return {
    type: 'SET_SESSION',
    ...session
  }
}

export const ParticipationSection = ({ person }) => {
  const [roleAsk, setRoleAsk] = useState(person.role.includes(Role.BASIC))
  const [roleOffer, setRoleOffer] = useState(person.role.includes(Role.VOLUNTEER))
  // const [topicGroups, setTopicGroups] = useState({ business: false, community: false, education: false })
  const session = useSelector(state => state.session)
  const dispatch = useDispatch()
  const updatePrefs = async prefs => {
    const res = await callApi('signUp', 'post', prefs)
    session.me = res
    dispatch(setSession(session)) // update the session
    dispatch(reduxApi.actions.people.get({ id: person._id })) // update the redux person
  }
  const handleChangeAsk = async (set) => {
    setRoleAsk(set)
    updatePrefs({ roleAsk: set })
  }

  const handleChangeOffer = async (set) => {
    setRoleOffer(set)
    updatePrefs({ roleOffer: set })
  }
  return (
    <ChooseParticipationButtons
      roleAsk={roleAsk} onChangeAsk={handleChangeAsk}
      roleOffer={roleOffer} onChangeOffer={handleChangeOffer}
    />
  )
}
