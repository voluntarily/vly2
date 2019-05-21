// Test translations example

import { FormattedMessage, FormattedNumber } from 'react-intl'
export default () =>
  <div>
    <h1>Test Internationalisation Formatting</h1>
    <FormattedMessage
      id='demo.greeting'
      defaultMessage='Replace in translation with Hello World!'
      description='Use the local equivalent of Hello World.'
    />
  &nbsp;
    <FormattedNumber value={1000} />
  </div>
