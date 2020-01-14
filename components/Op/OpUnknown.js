import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { Button } from 'antd'

export const OpUnknown = () =>
  <>
    <h2>
      <FormattedMessage
        id='opDetailPage.OpNotFound'
        defaultMessage='Sorry, this opportunity is not available'
        description='Op not found message'
      />
    </h2>
    <Link href='/search'>
      <Button shape='round'>
        <FormattedMessage
          id='opDetailPage.showOps'
          defaultMessage='Search for more'
          description='Button to show all opportunities'
        />
      </Button>
    </Link>
  </>
export default OpUnknown
