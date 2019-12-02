import styled from 'styled-components'
import { Icon } from 'antd'
import Link from 'next/link'

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
  }
`

const IconContainer = styled.div`
  align-self: center;
`

const TextContainer = styled.div`
  margin-bottom: 0;
  margin-top: 0rem;
`

const OpArchivedHeader = ({ date }) => (
  <HeaderContainer>
    <IconContainer>
      <Icon type='history' style={{ fontSize: '32px', color: 'white' }} />
    </IconContainer>
    <TextContainer>
      <h4>
        This activity has already happened, but you can still get involved with{' '}
        <Link href='/'>
          <a style={{ color: '#CFBCF2' }}>similar activities here</a>
        </Link>
      </h4>
    </TextContainer>
  </HeaderContainer>
)

export default OpArchivedHeader
