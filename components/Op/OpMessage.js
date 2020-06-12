import { ContentCard } from '../VTheme/VTheme'
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
`

const OpMessage = ({ date, time, comment, image, username }) => (
  <Comment>
    <DateBlock>
      <p>
        {date}
        <br />
        {time}
      </p>
    </DateBlock>
    <ContentCard>
      <p>{comment}</p>
      <div style={{ display: 'flex', alignSelf: 'center' }}>
        <img src={image} style={{ height: '2rem', width: '2rem', borderRadius: '100%', marginRight: '0.5rem', border: 'none', backgroundColor: 'none' }} />
        <p style={{ marginBottom: '0', alignSelf: 'center' }}>{username}</p>
      </div>
    </ContentCard>
  </Comment>
)

export default OpMessage
