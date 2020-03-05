import React from 'react'
import { storiesOf } from '@storybook/react'
import GenericClose from './GenericClose'
import { FullPage } from '../VTheme/VTheme'

storiesOf('Close Component', module)
  .add('Closing an Activity', () => (
    <FullPage>
      <GenericClose />
    </FullPage>
  ))
