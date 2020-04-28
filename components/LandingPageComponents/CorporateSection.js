import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { TitleContainerMid, H2 } from '../VTheme/VTheme'

const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  @media screen and (min-width: 1026px) and (max-width: 1289px) {
    grid-template-columns: 1fr 1fr ;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    
    grid-template-columns: 1fr ;
    margin: 2rem 0 ;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;

  gap: 0;
    margin: 0 ;
  }
`

const OfferCard = styled.div`
  
display: grid;
gap:1.5rem;
grid-template-columns: 1fr;
width: 100%;
text-align: center;
  background: #ffffff;

  -webkit-transition: all 0.2s;
  transition: all 0.2s;

figcaption {
  position: relative;

  margin: 0;
width: 100%;

}

  h3 {
    bottom: 0;
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: -0.38px;
    line-height: 1.5;
    color: #653cad;

    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
  }
  small {
  font-size: 1rem
}
 img{ 
   margin-bottom: 1rem;
  width: 60%;
}

  :hover {
    transform: scale(1.01);
    h3 {
      color: #653cad;
    }
  }

  /* Tablet */
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    min-height: 19rem;
    img{ 
  width: 30%; 
    }
    p {
      width: 60%;
      margin: 0 auto;
    }
   }

  /* Mobile */
  @media screen and (max-width: 768px) {
    min-height: 22rem;
    
  }

  /* Mobile */
  @media screen and (max-width: 668px) {
    min-height: 22rem;

    width: calc(100vw - 2rem);
    text-align: left;
   

  h3 {
    bottom: 0;
    font-size: 1.5rem;
  
  }

  }



`

const CorporateSection = () => (
  <div>
    <TitleContainerMid><H2>How we help organizations</H2></TitleContainerMid>
    <OfferContainer>

      <Link href='/a/ask'>

        <a>

          <OfferCard>
            <figcaption>
              <img src='/static/img/about/org-1.svg' />
              <h3>Businesses</h3>
              <p>Connect with people who want to help you, and organise how they can volunteer to help

              </p>
            </figcaption>
          </OfferCard>
        </a>
      </Link>

      <Link href='/a/offer'>
        <a>
          <OfferCard>

            <figcaption>
              <img src='/static/img/about/org-2.svg' />
              <h3>Community groups</h3>
              <p>Connect with people who want to help you, and organise how they can volunteer to help

              </p>
            </figcaption>
          </OfferCard>
        </a>
      </Link>

      <a rel='noopener noreferrer' target='_blank' href='https://blog.voluntarily.nz/get-involved'>
        <OfferCard>

          <figcaption>
            <img src='/static/img/about/org-3.svg' />
            <h3>Industry groups</h3>
            <p>Manage your business CSR programme and supercharge your community movement

            </p>

          </figcaption>
        </OfferCard>
      </a>
    </OfferContainer>

  </div>

)

export default CorporateSection
