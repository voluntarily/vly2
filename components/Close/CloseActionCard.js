import styled from 'styled-components'
import Link from 'next/link'
const CloseContainer = styled.article`

border-radius: 8px;
box-shadow: 1px 1px 24px 0 rgba(0,0,0,0.2);
padding: 1.5rem;
display: grid;
grid-template-columns: 3.5rem 1fr;
transition: all 0.3s;
margin-bottom: 1rem;


p {
    margin-bottom: 0;
}

:hover {
    box-shadow: 2px 2px 24px 0 rgba(0,0,0,0.5);
}

`

const CloseCard = ({ cardTitle, imgLink, link }) => (
  <Link src={link}>
    <a>
      <CloseContainer>
        <img src={imgLink} alt={cardTitle} />
        <div>
          <p><strong>Invite Friends &amp; parents</strong></p>
          <p>Invite your community to do this activity</p>
        </div>
      </CloseContainer>
    </a>
  </Link>
)

export default CloseCard
