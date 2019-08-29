import React from 'react'
import { storiesOf } from '@storybook/react'
import OpCard from './OpCard'
import OpList from './OpList'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import ops from './__tests__/Op.fixture'

storiesOf('Opportunity Cards', module)
  .add('Small OpCard', () => (
    <StoryIntroContainer>
      <OpCard size='Small' op={ops[0]} key='1' />
    </StoryIntroContainer>

  ))

  .add('Big OpCard', () => (
    <StoryIntroContainer>
      <OpCard size='Big' op={ops[0]} key='1' />
    </StoryIntroContainer>

  ))
  .add('OpList', () => (
    <div>
      <StoryIntroContainer>
        <OpList ops={ops} />
      </StoryIntroContainer>

    </div>
  ))
