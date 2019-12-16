/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import GoalList from '../Goal/GoalList'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { goalGroupHeading } from './GoalGroupHeading'

const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`

export const GoalSection = ({ goals }) => {
  if (!goals.length) return ''
  const heading = goalGroupHeading(goals[0].group)
  return (
    <>
      <SectionTitleWrapper>
        <h2><FormattedMessage {...heading.title} /></h2>
        <h5><FormattedMessage {...heading.subtitle} /></h5>
      </SectionTitleWrapper>
      <GoalList goals={goals} />
    </>
  )
}

export default GoalSection
