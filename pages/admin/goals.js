/*
  GoalListPage - a page listing all the goals returned from fetchGoals
  results in simple vertical list
  Entry - goals menu item.
*/
import Cookie from 'js-cookie'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import GoalSection from '../../components/Goal/GoalSection'
import { FullPage, Section } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withGoals } from '../../lib/redux/reduxApi.js'
import { Button, message } from 'antd'
// import Link from 'next/link'
import callApi from '../../lib/callApi'

function groupBy (arr, property) {
  return arr.reduce(function (memo, x) {
    if (!memo[x[property]]) { memo[x[property]] = [] }
    memo[x[property]].push(x)
    return memo
  }, {})
}

const handleAssignGoalCategory = async (category) => {
  try {
    await callApi(`xadmin/assignPersonalGoals?category=${category}`)
    message.success('done')
  } catch (e) { console.error('handleAssignGoalCategory Failed', e) }
}

const handleLoadGoals = async () => {
  try {
    await callApi('xadmin/loadGoals')
    message.success('done')
  } catch (e) { console.error('loadGoals Failed', e) }
}
class GoalListPage extends Component {
  static async getInitialProps ({ store, req }) {
    const cookies = req ? req.cookies : Cookie.get()
    // Get all Goals
    try {
      const cookiesStr = JSON.stringify(cookies)
      await store.dispatch(reduxApi.actions.goals.get(undefined, {
        params: cookiesStr
      }))
    } catch (err) {
      console.error('error in getting goals', err)
    }
  }

  render () {
    const goals = this.props.goals.data
    const categories = groupBy(goals, 'category')
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Goals Index</title>
        </Helmet>
        <h1><FormattedMessage id='goalListTitle' defaultMessage='Goals Index' description='title on Goal index page' /></h1>
        <Section>
          <h2>Load Goals</h2>
          <p>Clear goals from the database and reload from the sources goals.init.js file</p>
          <Button shape='round' type='primary' onClick={handleLoadGoals}>Load Goals</Button>
        </Section>
        {Object.keys(categories).map(key =>
          <Section key={key}>
            <GoalSection goals={categories[key]} />
            <Button
              shape='round'
              onClick={() => handleAssignGoalCategory(key)}
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
}
export const GoalListPageTest = GoalListPage
export default securePage(withGoals(GoalListPage))
