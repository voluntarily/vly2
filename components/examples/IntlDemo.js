// Test translations example

import { FormattedMessage, FormattedNumber } from 'react-intl'

const IntlDemo = () =>
  <div>
    <h1>Test Internationalisation Formatting</h1>
    <span>
      <FormattedMessage
        id='demo.greeting'
        defaultMessage='Replace in translation with Hello World!'
        description='Use the local equivalent of Hello World.'
      />
    </span>
    &nbsp;
    <span>
      <FormattedNumber value={1000} />
    </span>
  </div>

export default IntlDemo
