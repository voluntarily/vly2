import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Button } from 'antd'

const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0 4rem 0;
  @media screen and (min-width: 1026px) and (max-width: 1289px) {
    grid-template-columns: 1fr 1fr ;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {

    grid-template-columns: 1fr ;
    margin: 2rem 0 ;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    margin: 2rem 0 ;
  }
`

const OfferCard = styled.div`

  padding: 1.5rem;
display: grid;
gap:1.5rem;
grid-template-columns: 1fr;
width: 100%;
  background: #ffffff;
  box-shadow: 2px 2px 16px 0 rgba(118, 118, 118, 0.5);
  border-radius: 8px;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
min-height: 23rem;

figcaption {
  position: relative;
}

  h3 {
    bottom: 0;
    font-size: 2rem;
    font-weight: bold;
    letter-spacing: -0.38px;
    line-height: 1.5;

    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
  }
  small {
  font-size: 1rem
}
 img{ margin-top: 1rem;}

  :hover {
    transform: scale(1.01);
    h3 {
      color: #653cad;
    }
  }

  /* Tablet */
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    min-height: 19rem;
   }

  /* Mobile */
  @media screen and (max-width: 768px) {
    min-height: 22rem;
  }

  /* Mobile */
  @media screen and (max-width: 668px) {
    min-height: 22rem;

    width: calc(100vw - 2rem);

  padding: 2rem;


  h3 {
    bottom: 0;
    font-size: 1.5rem;

  }

  }

`

const OfferSection = () => (
  <div>

    <OfferContainer>

      <Link href='/acts'>
        <a>
          <OfferCard>
            <figcaption>

              <h3>Find jobs</h3>
              <p>Jobs to suit any situation. Full time, temporary, seasonal or voluntary. Help support local businesses providing services during the pandemic. We can help match you with the right job in your area.</p>
              <Button size='large' shape='round' type='primary' style={{ position: 'absolute', bottom: '0', marginBottom: 60 }}>I'm looking for work</Button>
              <Button size='large' shape='round' type='primary' style={{ position: 'absolute', bottom: '0' }}>I'm a group looking for work</Button>
            </figcaption>
          </OfferCard>
        </a>
      </Link>

      <Link href='/acts'>
        <a>
          <OfferCard>

            <figcaption>

              <h3>List jobs</h3>
              <p>If you need one additional employee or a large group to cover a sudden demand we can help. Advertise any type of employment whether it's full time, temporary, seasonal or voluntary.</p>
              <Button size='large' shape='round' type='primary' style={{ position: 'absolute', bottom: '0', marginBottom: 60 }}>I have jobs available</Button>
              <Button size='large' shape='round' type='primary' style={{ position: 'absolute', bottom: '0' }}>I have jobs available for a group</Button>
            </figcaption>
          </OfferCard>
        </a>
      </Link>

    </OfferContainer>

  </div>

)

export default OfferSection
