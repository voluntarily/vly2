import styled from 'styled-components'

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

// start date block
const DateBlock = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
  p {
  
    color: #999;
    opacity: 0.6;
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

const OpEvent = ({ date, time, username, message }) => (

  <Comment>
    <DateBlock>
      <p>
        {date}
        <br />
        {time}
      </p>
    </DateBlock>
    <EventContainer>
      <div />
      <section>
        <p>
          {message} <strong>{username}</strong>
        </p>

      </section>
      <div />
    </EventContainer>
  </Comment>
)

export default OpEvent
