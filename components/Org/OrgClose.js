
import CloseCard from '../Close/CloseActionCard'
import { Divider } from 'antd'
import styled from 'styled-components'
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

const OrgClose = () => (
  <CloseGrid>
    <img src='/static/img/goal/goal-first-volunteer.png' />
    <div>
      <SmallHeader>

        <FormattedMessage
          defaultMessage='School Created'
          id='orgSchoolSubheading'
          description='subheading for school created'
        />
      </SmallHeader>
      <h2>
        <FormattedMessage
          defaultMessage='You can now start recruiting volunteers and bringing staff onto the platform!'
          id='orgSchoolHeading'
          description='Heading for school created'
        />
      </h2>
      <Divider />
      <p>
        <FormattedMessage
          defaultMessage='Try the following things next:'
          id='orgSchoolActionHeading'
          description='Heading for school next actions'
        />
      </p>
      <CloseCard cardTitle='Try an inspiring the future activity' cardDescription='Invite volunteers into your school to talk about their careers. Inspire. Excite. Ignite.' imgLink='/static/img/actions/itf.png' link='#' />
      <CloseCard cardTitle='Invite Staff' cardDescription='Invite the rest of your school staff to use the platform and call in skilled volunteers as well' imgLink='/static/img/icons/invite.svg' link='#' />
      <CloseCard
        cardTitle='Create your first activity' cardDescription='Request help from skilled volunteers with this button' imgLink='/static/img/icons/create.svg' link='#'
      />
      <CloseCard cardTitle='Discover templates' cardDescription='Browse templates that other teachers and content providers have created for you to use in your school' imgLink='/static/img/icons/template.svg' link='#' />

    </div>
  </CloseGrid>
)

export default OrgClose
