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

  padding: 3rem;
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

      <Link href='/home'>

        <a>

          <OfferCard>
            <figcaption>

              <small>New!</small>
              <h3>Offer to help</h3>
              <p>
            Want to volunteer your time, or resources to help out someone in need? See what is needed and offer your skills.
              </p><Button size='large' shape='round' type='primary' style={{ position: 'absolute', bottom: '0' }}>See who needs help</Button>
            </figcaption>
          </OfferCard>
        </a>
      </Link>

      {/* <Link href='/act'> */}
      <a rel='noopener noreferrer' target='_blank' href='https://blog.voluntarily.nz/pre-register'>
        <OfferCard>

          <figcaption>

            <small>Coming soon</small>
            <h3>Ask for help</h3>
            <p>Coming this week. We make it easy to ask for exactly what you need.
            </p>
            <Button size='large' shape='round' type='primary' style={{ position: 'absolute', bottom: '0' }}>Coming soon</Button>
          </figcaption>
        </OfferCard>
      </a>
      {/* </Link> */}

      <a rel='noopener noreferrer' target='_blank' href='https://blog.voluntarily.nz/get-involved'>
        <OfferCard>

          <figcaption>
            <small>Open Source</small>
            <h3>Join the<br />Community Build</h3>
            <p>The entire project is open-source, and everyone is welcome to join. Click for more info.
            </p>

            <Button size='large' shape='round' type='primary' style={{ position: 'absolute', bottom: '0' }}>Join the build</Button>
          </figcaption>
        </OfferCard>
      </a>
    </OfferContainer>

  </div>

)

export default OfferSection
