
import { OpSectionGrid } from '../VTheme/VTheme'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, Input, Divider } from 'antd'
import OpFeedback from './OpFeedback'
import OpMessage from './OpMessage'
import OpEvent from './OpEvent'
import { OpTypeTense } from './OpType'
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

const ProfileCard = styled.div`
display: grid;
grid-template-columns: 4rem 1fr;
grid-column-gap: 1rem;
align-items: center;
img {
  width: 4rem;
  border-radius: 120px;
}
h3 {
  margin: 0;
}

`

const OpChatPanel = ({ op }) => {
  const Placeholder = op.requestor.nickname + ' is asking for your help - message them here'
  return (
    <>
      <OpSectionGrid>
        <div>
          <ProfileCard>
            <img src={op.requestor.imgUrl} />
            <h3><OpTypeTense type={op.type} /> {op.requestor.nickname}</h3>
          </ProfileCard>
          <Divider />
          <p>Contact details</p>
          <ul>
            <li>027 328 0872</li>

            <li>waltissomewhere@gmail.com</li>
          </ul>

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

      <OpEvent date='12 jan 2020' username={op.requestor.nickname} message='Your offer was accepted by ' />
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

      <OpEvent date='12 jan 2020' username={op.requestor.nickname} message='You offered to help' />
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
