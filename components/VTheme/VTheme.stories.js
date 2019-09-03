import React from 'react'
import { storiesOf } from '@storybook/react'
import IdLine from './IdLine'
import { StoryIntroContainer } from './VStoryTheme'
import ops from '../Op/__tests__/Op.fixture'

storiesOf('Minor Components', module)
  .add('IdLine Opportunity', () => (
    <StoryIntroContainer>
      <p>Single line link to an opportunity organisation</p>
      <IdLine item={ops[0].offerOrg} type='organisation' />
      <br /><br />
      <p>Single line link to an opportunity requestor</p>
      <IdLine item={ops[0].requestor} type='person' />
    </StoryIntroContainer>
  ))
