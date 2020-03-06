
import CloseCard from './CloseActionCard'
import { Divider } from 'antd'
import styled from 'styled-components'
const CloseGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 5rem;
max-width: 1280px;

img {
  width: 100%;
}


@media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: calc(50vw - 4rem) calc(50vw - 4rem);
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
`

const SmallHeader = styled.small`
color: #333;
font-size: 1rem;
`

const GenericClose = () => (
  <CloseGrid>
    <img src='https://picsum.photos/640/480' />
    <div>
      <SmallHeader>Activity created</SmallHeader>
      <h2>Volunteers can now see your activity and offer to help you out!</h2>
      <Divider />
      <p>Try the following things next:</p>
      <CloseCard cardTitle='Share Activity' cardDescription='Tell your community about your activity so they can get involved' imgLink='/static/img/icons/invite.svg' link='#' />

      <CloseCard cardTitle='See your Dashboard' cardDescription='See what you have signed up for' imgLink='/static/img/icons/invite.svg' link='#' />

      <CloseCard cardTitle='Find more things to do' cardDescription='aaa' imgLink='/static/img/icons/dash.svg' link='#' />

    </div>
  </CloseGrid>
)

export default GenericClose
