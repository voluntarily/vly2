import React from 'react'
import { storiesOf } from '@storybook/react'
import OpCard from './OpCard'
import OpList from './OpList'
import OpDetail from './OpDetail'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import ops from './__tests__/Op.fixture'

storiesOf('Opportunity Cards', module)
  .add('Small OpCard', () => (
    <StoryIntroContainer>
      <OpCard size='Small' op={ops[0]} key='1' />
    </StoryIntroContainer>

  ))
  .add('Small OpCard with open date', () => (
    <StoryIntroContainer>
      <OpCard size='Small' op={ops[1]} key='1' />
    </StoryIntroContainer>

  ))
  .add('Small OpCard with start/end date', () => (
    <StoryIntroContainer>
      <OpCard size='Small' op={ops[3]} key='1' />
    </StoryIntroContainer>

  ))
  .add('Big OpCard', () => (
    <StoryIntroContainer>
      <OpCard size='Big' op={ops[0]} key='2' />
    </StoryIntroContainer>

  ))
  .add('OpList', () => (
    <div>
      <StoryIntroContainer>
        <OpList ops={ops} />
      </StoryIntroContainer>

    </div>
  ))
  .add('OpDetail', () => (
    <StoryIntroContainer>
      <OpDetail op={ops[0]} onPress={() => {}} />
    </StoryIntroContainer>

  ))
