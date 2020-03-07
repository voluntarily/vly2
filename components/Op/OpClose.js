
import CloseCard from '../Close/CloseActionCard'
import { Divider } from 'antd'
import styled from 'styled-components'
import OpPreview from './OpPreview'
import { FormattedMessage } from 'react-intl'
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

const ActClose = () => (
  <CloseGrid>
    <img src='/static/img/goal/goal-first-volunteer.png' />
    <div>
      <SmallHeader>
        <FormattedMessage
          defaultMessage='Activity Created'
          id='actCreated'
          description='subheading for activity created'
        />
      </SmallHeader>
      <h2>
        <FormattedMessage
          defaultMessage='Volunteers can now see your activity and offer to help you out!'
          id='actCreatedTitle'
          description='heading for activity created'
        />
      </h2>
      <OpPreview />
      <Divider />
      <p>
        <FormattedMessage
          defaultMessage='Try the following things next:'
          id='actCreatedSub'
          description='heading for activity creation actions'
        />
      </p>
      <CloseCard cardTitle='Share Activity' cardDescription='Tell your community about your activity so they can get involved' imgLink='/static/img/icons/invite.svg' link='#' />

      <CloseCard cardTitle='See your Dashboard' cardDescription='See what you have signed up for' imgLink='/static/img/icons/home.svg' link='#' />

      <CloseCard cardTitle='Find more cool volunteering opportunities' cardDescription='Help loads of people' imgLink='/static/img/icons/search-act.svg' link='#' />

    </div>
  </CloseGrid>
)

export default ActClose
