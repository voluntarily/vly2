import React from 'react'
import { storiesOf } from '@storybook/react'
import { StoryIntroContainer } from './VStoryTheme'

import {
  CalendarOutlined,
  DownloadOutlined,
  LeftOutlined,
  MailOutlined,
  PhoneOutlined,
  ProfileOutlined,
  RightOutlined
} from '@ant-design/icons'

import { Button, Divider } from 'antd'
import { H1, H4 } from './VTheme'

storiesOf('Minor Components', module)
  .add('IdLine Opportunity', () => (
    <StoryIntroContainer>
      <p>Single line link to an opportunity organisation</p>

      <br />
      <br />
      <p>Single line link to an opportunity requestor</p>

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
      <Button type='primary' icon={<DownloadOutlined />} size='large' />
      <Button type='primary' shape='circle' icon={<CalendarOutlined />} size='large' />
      <Button type='primary' shape='round' icon={<PhoneOutlined />} size='large' />
      <Button type='primary' shape='round' icon={<MailOutlined />} size='large'>
        Download
      </Button>
      <Button type='primary' icon={<ProfileOutlined />} size='large'>
        Download
      </Button>
      <br /> <br /> <br />
      <Button.Group size='large'>
        <Button type='primary'>
          <LeftOutlined />
          Backward
        </Button>
        <Button type='primary'>
          Forward
          <RightOutlined />
        </Button>
      </Button.Group>
    </StoryIntroContainer>
  ))
