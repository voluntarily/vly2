import React from 'react'
import { storiesOf } from '@storybook/react'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import GenericClose from './GenericClose'

storiesOf('Close Component', module)
  .add('Closing an Activity', () => (
    <StoryIntroContainer>
      <GenericClose />
    </StoryIntroContainer>
  ))
