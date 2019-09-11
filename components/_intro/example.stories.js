import { storiesOf } from '@storybook/react'
import { Divider } from 'antd'
import React from 'react'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import { H1, H3, P } from '../VTheme/VTheme'

storiesOf('Example story', module)
  .add('example item', () => (
    <StoryIntroContainer>
      <H1>Component Name</H1>
      <P> a description goes here</P>
      <Divider />
      <H3>Stick your component here</H3>
    </StoryIntroContainer>
  ))
