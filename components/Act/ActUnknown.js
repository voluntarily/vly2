import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button } from 'antd'

export const ActUnknown = () =>
  <>
    <h2>
      <FormattedMessage
        id='ActUnknown.NotFound'
        defaultMessage='Sorry, this activity is not available'
        description='Act not found message'
      />
    </h2>
    <Link href='/acts'>
      <Button shape='round'>
        <FormattedMessage
          id='ActUnknown.showOps'
          defaultMessage='Search for more'
          description='Button to show all activities'
        />
      </Button>
    </Link>
  </>
export default ActUnknown
