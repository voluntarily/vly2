import React from 'react'
import { storiesOf } from '@storybook/react'
import GenericClose from './GenericClose'
import { FullPage } from '../VTheme/VTheme'

storiesOf('Close Component', module)
  .add('Finish creating an Activity', () => (
    <FullPage>
      <GenericClose />
    </FullPage>
  ))
  .add('Finish creating an account', () => (
    <FullPage>
      <GenericClose />
    </FullPage>
  ))
