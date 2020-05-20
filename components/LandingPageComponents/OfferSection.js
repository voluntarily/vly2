import React from 'react'
import styled from 'styled-components'
import { OfferCard } from '../VTheme/VTheme'

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

const OfferSection = () => (
  <div>
    <OfferContainer>

      <a href='/a/ask'>

        <OfferCard>
          <figcaption style={{ gridColumnGap: '0rem' }}>
            <img src='/static/img/started-1.png' />
            <div>
              <h3>Ask for help from volunteers</h3>
              <p>Connect with people who want to help you, and organise how they can volunteer to help
              </p>
            </div>
          </figcaption>
        </OfferCard>
      </a>

      <a href='/a/offer'>
        <OfferCard>

          <figcaption style={{ gridColumnGap: '0rem' }}>
            <img src='/static/img/started-2.png' />
            <div>
              <h3>Offer to help your community</h3>
              <p>Connect with people in your community who need help
              </p>
            </div>
          </figcaption>
        </OfferCard>
      </a>

      <a href='#org'>
        <OfferCard>

          <figcaption style={{ gridColumnGap: '0rem' }}>
            <img src='/static/img/started-3.png' />
            <div>
              <h3>Bring your organisation</h3>
              <p>Manage your business CSR programme and supercharge your community movement
              </p>
            </div>
          </figcaption>
        </OfferCard>
      </a>

    </OfferContainer>

  </div>

)

export default OfferSection
