import styled from 'styled-components'
import { HistoryOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { OpportunityStatus } from '../../server/api/opportunity/opportunity.constants'

const HeaderContainer = styled.div`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;

  display: grid;
  grid-template-columns: 3rem 1fr;

  background-color: #3b3b3b;
  margin-bottom: -5rem;
  h4 {
    color: white;
    font-weight: 600;

    a {
      filter: brightness(150%);
    }
  }
`

const IconContainer = styled.div`
  align-self: center;
`

const TextContainer = styled.div`
  margin-bottom: 0;
  margin-top: 0rem;
`

export const OpArchivedHeader = ({ status }) => (
  <HeaderContainer>
    <IconContainer>
      <HistoryOutlined style={{ fontSize: '32px', color: 'white' }} />
    </IconContainer>
    <TextContainer>
      <h4>
        {status === OpportunityStatus.COMPLETED
          ? (
            <FormattedMessage
              id='OpArchivedHeader.Completed.message'
              defaultMessage='This activity has already happened, but you can still get involved with'
              description='Message in banner activity has completed'
            />)
          : (
            <FormattedMessage
              id='OpArchivedHeader.Cancelled.message'
              defaultMessage='This activity was cancelled, but you can still get involved with'
              description='Message in banner activity has cancelled'
            />)}
        {' '}
        <Link href='/'>
          <a>
            <FormattedMessage
              id='OpArchivedHeader.link'
              defaultMessage='similar activities here'
              description='Message in banner activity has completed link text'
            />
          </a>
        </Link>
      </h4>
    </TextContainer>
  </HeaderContainer>
)

export default OpArchivedHeader
