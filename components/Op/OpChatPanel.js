
import { OpSectionGrid } from '../VTheme/VTheme'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, Input } from 'antd'
import OpFeedback from './OpFeedback'
import OpMessage from './OpMessage'
import OpEvent from './OpEvent'
const { TextArea } = Input
// start question

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
const OpChatPanel = ({ op }) => {
  const Placeholder = op.requestor.nickname + ' is asking for your help - message them here'
  return (
    <>
      <OpSectionGrid>
        <div>
          <h2>You offered to help {op.requestor.nickname}</h2>
          <>

          </>

        </div>

        <AskContainer>
          <p>Send message</p>
          <TextArea rows={3} placeholder={Placeholder} />
          <ButtonContainer>
            <Button shape='round' size='large' type='primary'>
              Submit
            </Button>
          </ButtonContainer>
        </AskContainer>

      </OpSectionGrid>
      <OpFeedback date='22 Jan 2022' time='11:00pm' username={op.requestor.nickname} />

      <OpMessage
        date='12 Jan 2020'
        time='5:00pm'
        comment='yes i can supply agile potato training'
        image='https://images.unsplash.com/photo-1588614478415-f25a77edc40f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1583&q=80'
        username={op.requestor.nickname}
      />
      <OpMessage
        date='12 Jan 2020'
        time='5:00pm'
        comment='Hello can I get agile potatoes pls'
        image='https://images.unsplash.com/photo-1591647053371-504b4a2958e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
        username='You'
      />

      <OpEvent date='12 jan 2020' username={op.requestor.nickname} />
    </>
  )
}

OpChatPanel.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    requestor: PropTypes.object,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    venue: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string
  })
}

export default OpChatPanel
