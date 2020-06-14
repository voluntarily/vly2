import React from 'react'
import styled from 'styled-components'
import { TitleContainerMid, H2, OfferCard } from '../VTheme/VTheme'

const OfferContainer = styled.div`
margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  @media screen and (min-width: 1026px) and (max-width: 1289px) {
    grid-template-columns: 1fr ;
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

const CorporateSection = () => (
  <div id='org'>
    <TitleContainerMid><H2>How we help organizations</H2></TitleContainerMid>
    <OfferContainer>

      <a href='#orgs'>
        <OfferCard>
          <figcaption>
            <img src='/static/img/about/org-1.svg' />
            <div>
              <h3>Businesses</h3>
              <p>Connect with people who want to help you, and organise how they can volunteer to help
              </p>
            </div>
          </figcaption>
        </OfferCard>
      </a>

      <a href='#groups'>
        <OfferCard>

          <figcaption>

            <img src='/static/img/about/org-2.svg' />
            <div>
              <h3>Community groups</h3>
              <p>Connect with people who want to help you, and organise how they can volunteer to help</p>
            </div>
          </figcaption>
        </OfferCard>
      </a>

      <a href='#content'>
        <OfferCard>

          <figcaption>
            <img src='/static/img/about/org-3.svg' />
            <div>
              <h3>Industry groups</h3>
              <p>Manage your business CSR programme and supercharge your community movement
              </p>
            </div>
          </figcaption>
        </OfferCard>
      </a>
    </OfferContainer>
  </div>

)

export default CorporateSection
