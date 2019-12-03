/* Display a grid of goal cards from an personal goals
 */
import React from 'react'
import GoalList from '../Goal/GoalList'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const SectionTitleWrapper = styled.div`
  margin: 2rem 0rem;
`

const GoalSection = ({ goals }) => (
  goals &&
    <>
      <SectionTitleWrapper>
        <h2>{goals[0].category}</h2>
        <h5>
          <FormattedMessage
            id='GoalSection.subheading'
            defaultMessage='Here are a few things we recommend doing:'
            description='subheading under category title for list of goals'
          />
        </h5>
      </SectionTitleWrapper>
      <GoalList goals={goals} />
    </>
)

export default GoalSection
