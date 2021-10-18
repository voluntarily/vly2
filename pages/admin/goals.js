/*
  GoalListPage - a page listing all the goals returned from fetchGoals
  results in simple vertical list
  Entry - goals menu item.
*/
import { useState, useEffect } from 'react'
import fetch from 'isomorphic-fetch'
import { Button, message } from 'antd'
import Head from 'next/head'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

import GoalSection from '../../components/Goal/GoalSection'
import { FullPage, Section } from '../../components/VTheme/VTheme'
import reduxApi from '../../lib/redux/reduxApi.js'
import AccessDenied from '../../components/Navigation/AccessDenied'

function groupBy (arr, property) {
  return arr.reduce(function (memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = [] }
    memo[x[property]].push(x)
    return memo
  }, {})
}

const handleAssignGoalRole = async (group) => {
  try {
    await fetch(`/api/xadmin/assignPersonalGoals?group=${group}`)
    message.success('done')
  } catch (e) { console.error('handleAssignGoalRole Failed', e) }
}

const GoalListPage = ({ isAdmin }) => {
  const dispatch = useDispatch()
  const [updatedGoals, setUpdatedGoals] = useState(false)
  const goalsData = useSelector(state => state.goals)
  // here we use client side dispatch to get the goals so that we can see updates
  useEffect(() => {
    const getGoals = async () => {
      await dispatch(reduxApi.actions.goals.get())
    }
    if (isAdmin) {
      getGoals()
    }
  }, [updatedGoals, dispatch, isAdmin])

  const handleLoadGoals = async () => {
    try {
      await fetch('/api/xadmin/loadGoals')
      setUpdatedGoals(true)
      message.success('done')
    } catch (e) { console.error('loadGoals Failed', e) }
  }
  const goals = goalsData.data
  const groups = groupBy(goals, 'group')
  if (!isAdmin) return <AccessDenied />
  return (
    <FullPage>
      <Head>
        <title>Voluntarily - Goals Index</title>
      </Head>
      <h1><FormattedMessage id='goalListTitle' defaultMessage='Goals Index' description='title on Goal index page' /></h1>
      <Section>
        <h2>Load Goals</h2>
        <p>Clear goals from the database and reload from the sources goals.init.js file</p>
        <Button shape='round' type='primary' onClick={handleLoadGoals}>Load Goals</Button>
      </Section>
      {Object.keys(groups).map(key =>
        <Section key={key}>
          <GoalSection goals={groups[key]} />
          <Button
            shape='round'
            onClick={() => handleAssignGoalRole(key)}
          >
            <FormattedMessage
              id='GoalsListPage.AssignGoalGroupToMe'
              defaultMessage='Assign me this group'
              description='TEST: button title that assigns the listed group of goals to the current person'
            />
          </Button>
        </Section>
      )}
    </FullPage>
  )
}

export default GoalListPage
