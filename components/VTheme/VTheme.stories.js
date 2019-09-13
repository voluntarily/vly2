import React from 'react'
import { storiesOf } from '@storybook/react'
import IdLine from './IdLine'
import { StoryIntroContainer } from './VStoryTheme'
import ops from '../Op/__tests__/Op.fixture'
import { Button, Icon, Divider } from 'antd'
import { H1, H4 } from './VTheme'

storiesOf('Minor Components', module)
  .add('IdLine Opportunity', () => (
    <StoryIntroContainer>
      <p>Single line link to an opportunity organisation</p>
      <IdLine item={ops[0].offerOrg} type='organisation' />
      <br />
      <br />
      <p>Single line link to an opportunity requestor</p>
      <IdLine item={ops[0].requestor} type='person' />
    </StoryIntroContainer>
  ))

  .add('Buttons', () => (
    <StoryIntroContainer>
      <H1>Buttons</H1>
      <H4>How we use buttons from the antd library on the platform</H4>
      <Divider />
      <br />
      <Button type='primary' size='large'>
        Primary
      </Button>
      <Button size='large'>Normal</Button>
      <Button type='dashed' size='large'>
        Dashed
      </Button>
      <Button type='danger' size='large'>
        Danger
      </Button>
      <Button type='link' size='large'>
        Link
      </Button>
      <br /> <br /> <br />
      <Button type='primary' icon='download' size='large' />
      <Button type='primary' shape='circle' icon='calendar' size='large' />
      <Button type='primary' shape='round' icon='phone' size='large' />
      <Button type='primary' shape='round' icon='mail' size='large'>
        Download
      </Button>
      <Button type='primary' icon='profile' size='large'>
        Download
      </Button>
      <br /> <br /> <br />
      <Button.Group size='large'>
        <Button type='primary'>
          <Icon type='left' />
          Backward
        </Button>
        <Button type='primary'>
          Forward
          <Icon type='right' />
        </Button>
      </Button.Group>
    </StoryIntroContainer>
  ))
