import React from 'react'
import styled from 'styled-components'

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
  width: 100%;
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
  width: 60%;
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

const OfferSection = () => (
  <div>

    <OfferContainer>

      <a href='#ask'>

        <OfferCard>
          <figcaption>
            <img src='/static/img/started-1.png' />
            <h3>Ask for help from volunteers</h3>
            <p>Connect with people who want to help you, and organise how they can volunteer to help

            </p>
          </figcaption>
        </OfferCard>
      </a>

      <a href='#offer'>
        <OfferCard>

          <figcaption>
            <img src='/static/img/started-2.png' />
            <h3>Offer to help your community</h3>
            <p>Connect with people in your community who need help
            </p>
          </figcaption>
        </OfferCard>
      </a>

      <a href='#org'>
        <OfferCard>

          <figcaption>
            <img src='/static/img/started-3.png' />
            <h3>Bring your organisation</h3>
            <p>Manage your business CSR programme and supercharge your community movement

            </p>

          </figcaption>
        </OfferCard>
      </a>

    </OfferContainer>

  </div>

)

export default OfferSection
