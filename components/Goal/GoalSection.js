/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import GoalList from '../Goal/GoalList'
import { FormattedMessage } from 'react-intl'
import { goalGroupHeading } from './GoalGroupHeading'
import { ProfileSection, ProfileSectionTitle } from '../VTheme/Profile'
import { Divider } from 'antd'

export const GoalSection = ({ goals }) => {
  if (!goals.length) return ''
  const heading = goalGroupHeading(goals[0].group)
  return (
    <>
      <ProfileSection>
        <ProfileSectionTitle>
          <FormattedMessage {...heading.title} />
          <small><FormattedMessage {...heading.subtitle} /></small>
        </ProfileSectionTitle>
        <GoalList goals={goals} />
      </ProfileSection>
      <Divider />
    </>
  )
}

export default GoalSection
