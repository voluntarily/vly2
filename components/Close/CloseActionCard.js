import styled from 'styled-components'
import Link from 'next/link'
const CloseContainer = styled.article`

display: grid;
padding: 1.5rem;
margin-bottom: 1rem;
grid-template-columns: 3.5rem 1fr;
gap: 1.5rem;

border-radius: 8px;
box-shadow: 1px 1px 24px 0 rgba(0,0,0,0.2);

transition: all 0.3s;

  div {
    align-self: center;
  }

  p {
      margin-bottom: 0;
  }

  :hover {
      box-shadow: 2px 2px 24px 0 rgba(0,0,0,0.5);
    p>strong {
      color: #653CAD;
    }
  }

`

const CloseCard = ({ cardTitle, imgLink, link }) => (
  <Link href={link}>
    <a>
      <CloseContainer>
        <img src={imgLink} alt={cardTitle} />
        <div>
          <p><strong>{cardTitle}</strong></p>
          <p>Invite your community to do this activity</p>
        </div>
      </CloseContainer>
    </a>
  </Link>
)

export default CloseCard
