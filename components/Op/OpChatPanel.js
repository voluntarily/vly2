
import { OpSectionGrid } from '../VTheme/VTheme'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, Input, Divider } from 'antd'
import moment from 'moment'
import { useSelector } from 'react-redux'
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
  @media screen and (max-width: 1280px) {
      max-height: 14rem;

  }
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

const ProfileDetails = styled.div`
ul{  }
li {
    white-space: normal;
    width: 100%;
}


  }
`

const OpChatPanel = ({ op }) => {
  const Placeholder = op.requestor.nickname + ' is asking for your help - message them here'
  const interests = useSelector(state => state.interests)
  const messages = interests.sync && interests.data ? sortMessage(interests.data) : []

  return (
    <>
      <OpSectionGrid>
        <div>
          <ProfileCard>
            <img src={op.requestor.imgUrl} />
            <h3><OpTypeTense type={op.type} /> {op.requestor.nickname}</h3>
          </ProfileCard>
          <Divider />
          <ProfileDetails>
            <p>Contact details</p>
            <ul>
              <li>027 328 0872</li>

              <li>waltissomewhere@gmail.com</li>
            </ul>
          </ProfileDetails>
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
      {!interests.sync && <img src='/static/loading.svg' />}
      {interests.sync && messages.map((message) => <OpMessage
        date={moment(message.createdAt).format("Do MMM YYYY")}
        time={moment(message.createdAt).format("h:mm a")}
        comment={message.body}
        key={message._id}
        image={message.author.imgUrl}
        username={message.author.nickname}
      />)}
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

function sortMessage(interestsData) {
  let allMessage = interestsData.reduce((acc, currentValue) => {
    return [...acc, ...currentValue.messages]
  }, [])
  return allMessage
}
