import { storiesOf } from '@storybook/react'
import { Divider } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { StoryIntroContainer } from '../VTheme/VStoryTheme'
import { H1,H3Black, P } from '../VTheme/VTheme'
import ConfirmDetails from '../Welcome/ConfirmDetails'

storiesOf('Test Components', module)
  .add('Confirm details', () => (
  <ConfirmDetails />
  ))