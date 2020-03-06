import React from 'react'
import { storiesOf } from '@storybook/react'
import OpClose from '../Op/OpClose'
import { FullPage } from '../VTheme/VTheme'
import OrgClose from '../Org/OrgClose'
import { Divider } from 'antd'

import { StoryIntroContainer } from '../VTheme/VStoryTheme'

storiesOf('Close Component', module)
  .add('Finish creating an Activity', () => (
    <>
      <StoryIntroContainer>
        <h1>Activity Created</h1>
        <p> The component you see when an activity is created by a teacher, or content provider</p>
        <Divider />
      </StoryIntroContainer>
      <FullPage>
        <OpClose />
      </FullPage>
    </>
  ))
  .add('Finish creating an account', () => (
    <FullPage>
      <OrgClose />
    </FullPage>
  ))
