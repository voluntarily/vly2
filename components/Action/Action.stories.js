import React from 'react'
import { storiesOf } from '@storybook/react'
import ActionCard from './ActionCard';
import NextActionBlockV2 from './NextActionBlockV2';
import { StoryIntroContainer } from '../VTheme/VStoryTheme';
import { Grid } from '../VTheme/VTheme'

storiesOf('Onboarding Components', module)
  .add('Action Card', () => (
      <StoryIntroContainer>
          <Grid>
    <ActionCard
        image='https://lorempixel.com/296/208/'
        name='Find someone to help'
        description='Teachers are asking for your help. There are many ways to get involved in your community'
        link='../search'
      />
      </Grid>
      </StoryIntroContainer>
 ))

  .add('Get Started List', () => (
      <StoryIntroContainer>
<NextActionBlockV2 />
</StoryIntroContainer>
  ))