
import CloseCard from '../Close/CloseActionCard'
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

const OrgClose = () => (
  <CloseGrid>
    <img src='/static/img/goal/goal-first-volunteer.png' />
    <div>
      <SmallHeader>School created</SmallHeader>
      <h2>You can now start recruiting volunteers and bringing staff onto the platform!</h2>
      <Divider />
      <p>Try the following things next:</p>
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
