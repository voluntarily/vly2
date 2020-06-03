
import { OpSectionGrid, ContentCard, P } from '../VTheme/VTheme'
import styled from 'styled-components'

import { Button, Input } from 'antd'
const { TextArea } = Input
// start question

const Comment = styled.div`
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 1rem;
  float: right;
  width: 59rem;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    width: calc(100vw - 2rem);
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    grid-template-columns: 1fr;
    margin-top: 1rem;
    float: left;
  }
`
const AskContainer = styled.div`
  padding: 1rem;
  width: 100%;
  background: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
  border-radius: 8px;
`

const ButtonContainer = styled.div`
  margin-top: 0.5rem;
`
// start date block
const DateBlock = styled.div`
  p {
    padding-top: 1rem;
    color: #999;
    letter-spacing: -0.3px;
    text-align: right;
    line-height: 24px;
    font-size: 1rem;


  @media screen and (max-width: 768px) {
display: none;
  }
  }
` // end date block

const OpChatPanel = ({ author }) => {
  return (
    <>
      <OpSectionGrid>
        <div>
          <h2>You offered to help USERNAME123</h2>
          <>

          </>

        </div>

        <AskContainer>
          <TextArea rows={3} placeholder='Ask a question here' />
          <ButtonContainer>
            <Button shape='round' size='large' type='primary'>
              Submit
            </Button>
          </ButtonContainer>
        </AskContainer>

      </OpSectionGrid>
      <Comment>
        <DateBlock>
          <p>
          29 Jan 2019
            <br />
          11:59PM
          </p>
        </DateBlock>
        <ContentCard>
          <p>Can I get free parking at the school? Happy to help but I need somewhere to park my car</p>
        </ContentCard>
      </Comment>
    </>
  )
}

export default OpChatPanel
