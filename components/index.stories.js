import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import styled from 'styled-components'

import { Button, Welcome } from '@storybook/react/demo'

const StoryIntroContainer = styled.div`
  margin: 4rem auto 0 auto;
  width: 50vw;
`

storiesOf('Welcome', module).add('Getting Started', () => (
  <StoryIntroContainer>
    <h1>Welcome</h1>
    <div>
      <p>Welcome to the Voluntarily Component Library. We currently use React,
      Next.JS and Styled Components to drive frontend development.</p>
      <p>Componets are separated into things</p>
    </div>

  </StoryIntroContainer>
))
