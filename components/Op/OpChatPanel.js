import React from 'react'
import { OpSectionGrid } from '../VTheme/VTheme'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Button, Input } from 'antd'
import reduxApi from '../../lib/redux/reduxApi'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
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
const OpChatPanel = ({ op }) => {
  const Placeholder = op.requestor.nickname + ' is asking for your help - message them here'
  const interests = useSelector(state => state.interests)
  const dispatch = useDispatch()
  const textRef = React.useRef(null)
  const messages = interests.sync && interests.data ? sortMessage(interests.data) : []

  const sendMessage = () => {
    const status = interests.data[0].status
    const newStatus = status
    const message = textRef.current.state.value
    const putInterest = {
      ...((status !== newStatus) && { status: newStatus }),
      ...(message && { messages: [{ body: message }] }),
      type: 'message',
      termsAccepted: true // can't get here without accepting the terms button.
    }
    if (interests.data[0]._id) {
      return dispatch(reduxApi.actions.interests.put({ id: interests.data[0]._id }, { body: JSON.stringify(putInterest) }))
    }

    const postInterest = { ...interests.data[0], ...putInterest }
    dispatch(reduxApi.actions.interests.post({}, { body: JSON.stringify(postInterest) }))
  }
  return (
    <>
      <OpSectionGrid>
        <div>
          <ProfileCard>
            <img src={op.requestor.imgUrl} />
            <h3><OpTypeTense type={op.type} /> {op.requestor.nickname}</h3>
          </ProfileCard>
        </div>

        <AskContainer>
          <p>Send message</p>
          <TextArea rows={3} placeholder={Placeholder} ref={textRef} />
          <ButtonContainer>
            <Button shape='round' size='large' type='primary' onClick={sendMessage}>
              Submit
            </Button>
          </ButtonContainer>
        </AskContainer>
      </OpSectionGrid>
      {!interests.sync && <img src='/static/loading.svg' />}
      {interests.sync && messages.map((message) => <OpMessage date={moment(message.createdAt).format('Do MMM YYYY')} time={moment(message.createdAt).format('h:mm a')} comment={message.body} key={message._id} image={message.author.imgUrl} username={message.author.nickname} />)}
      {interests.data[0] && <OpEvent date={moment(interests.data[0].createdAt).format('Do MMM YYYY')} username={op.requestor.nickname} message='You offered to help' />}
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

function sortMessage (interestsData) {
  const allMessage = interestsData.reduce((acc, currentValue) => {
    return [...acc, ...currentValue.messages]
  }, [])
  return allMessage.reverse()
}
