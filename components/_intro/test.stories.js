import { storiesOf } from '@storybook/react'
import { Divider } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import { H1,H3Black, P } from '../VTheme/VTheme'

storiesOf('Test Components', module)
  .add('Confirm details', () => (
    <StoryIntroContainer>
      <H3Black>Confirm your details</H3Black>
      <P>Check your details are correct :)</P>
      
      <Divider />
    </StoryIntroContainer>
  ))