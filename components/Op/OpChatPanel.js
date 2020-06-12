
import { OpSectionGrid, ContentCard } from '../VTheme/VTheme'
import styled from 'styled-components'

import { Button, Input } from 'antd'
import OpFeedback from './OpFeedback'
import OpMessage from './OpMessage'
import OpEvent from './OpEvent'
const { TextArea } = Input
// start question

const Comment = styled.div`
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 1rem;
  float: right;
  width: 59rem;
  margin-bottom: 1rem;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    width: calc(100vw - 2rem);
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    grid-template-columns: 1fr;

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
display: flex;
align-items: center;
justify-content: flex-end;
  p {
  
    color: #999;
    letter-spacing: -0.3px;
    text-align: right;
    line-height: 24px;
    font-size: 1rem;
    margin: 0;


  @media screen and (max-width: 768px) {
display: none;
  }
  }
` // end date block

const EventContainer = styled.div`
display: grid;
grid-template-columns: 1fr auto 1fr;
align-items: center;
margin: 1rem 0;
strong {
  font-weight: 700;
}
p {
 
  margin: 0 1rem;
  max-width: 40rem;
  text-align: center;
}

 div {
  height: 4px;
  width: 100%;
  background-color: #D8D8D8;
  border-radius: 32px;
  margin: 0 auto;
}
article{ 
  display: flex;
  justify-content: center;
}
button {
  margin-top: 0.5rem;
}

@media screen and (max-width: 768px) {
  grid-template-columns: 1fr;
  div {
    margin: 1.5rem 0;
  }
}

`

const OpChatPanel = ({ author }) => {
  return (
    <>
      <OpSectionGrid>
        <div>
          <h2>You offered to help <br />USERNAME123</h2>
          <>

          </>

        </div>

        <AskContainer>
          <p>Send message</p>
          <TextArea rows={3} placeholder='USERNAME is asking for your help - message them here' />
          <ButtonContainer>
            <Button shape='round' size='large' type='primary'>
              Submit
            </Button>
          </ButtonContainer>
        </AskContainer>

      </OpSectionGrid>
      <OpFeedback date='22 Jan 2022' time='11:00pm' username='Ben' />

      <OpMessage
        date='12 Jan 2020'
        time='5:00pm'
        comment='Hello can I get potatoes pls'
        image='https://images.unsplash.com/photo-1588614478415-f25a77edc40f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1583&q=80'
        username='WalrusWalnut Processor'
      />
      <OpMessage
        date='12 Jan 2020'
        time='5:00pm'
        comment='Hello can I get potatoes pls'
        image='https://images.unsplash.com/photo-1588614478415-f25a77edc40f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1583&q=80'
        username='Ben the Potato Farmer'
      />

      <OpEvent date='12 jan 2020' username='Ben' />
    </>
  )
}

export default OpChatPanel
