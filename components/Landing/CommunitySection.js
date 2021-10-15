import React from 'react'
import styled from 'styled-components'
// import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import SectionTitle from './SectionTitle'
import { Image } from 'antd'
const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 8rem;
  @media screen and (min-width: 1026px) and (max-width: 1289px) {
    grid-template-columns: 1fr 1fr ;

  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    
    grid-template-columns: 1fr ;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const OfferCard = styled.div`

  padding: 2rem;
display: grid;
gap:1.5rem;
grid-template-columns: 4rem 1fr;
width: 100%;
  background: #ffffff;
  box-shadow: 2px 2px 16px 0 rgba(118, 118, 118, 0.5);
  border-radius: 8px;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;


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

  img {
    align-self: center;
    width: 100%;
  }

  :hover {
    transform: scale(1.05);
    h3 {
      color: #653cad;
    }
  }

  /* Tablet */
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    min-height: initial;
   }

  /* Mobile */
  @media screen and (max-width: 768px) {
    min-height: initial;
  }

`

const CommunitySection = () => (
  <div>
    <SectionTitle>
      <FormattedMessage
        id='landing.sectiontitle.offers'
        defaultMessage='Get Started'
      />
    </SectionTitle>
    <OfferContainer>

      <a rel='noopener noreferrer' target='_blank' href='https://blog.voluntarily.nz'>
        <OfferCard>

          <Image alt='' src='/static/img/icons/code-party.svg' />
          <figcaption>
            <h3>Build the movement</h3>
            <p>The entire project is open-source, and everyone is welcome to join. Click for more info.

            </p>
          </figcaption>
        </OfferCard>
      </a>
      <a rel='noopener noreferrer' target='_blank' href='https://blog.voluntarily.nz/get-involved'>
        <OfferCard>

          <Image alt='' src='/static/img/icons/chat.svg' />
          <figcaption>
            <h3>Join the conversation</h3>
            <p>Join the community chat on Slack and help shape the future of the platform

            </p>
          </figcaption>
        </OfferCard>
      </a>
      {/* <Link href='/search'> */}

      <a rel='noopener noreferrer' target='_blank' href='https://blog.voluntarily.nz/pre-register'>

        <OfferCard>
          <Image alt='' src='/static/img/icons/ask.svg' />
          <figcaption>
            <h3>Can you help out? (coming soon)</h3>
            <p>
              Get help right now. We make it easy with templates that will take you through step-by-step to say exactly what you need.
            </p>
          </figcaption>
        </OfferCard>
      </a>
      {/* </Link> */}
      {/* <Link href='/act'> */}
      <a rel='noopener noreferrer' target='_blank' href='https://blog.voluntarily.nz/pre-register'>
        <OfferCard>

          <Image alt='' src='/static/img/icons/offer.svg' />
          <figcaption>
            <h3>Offer to Help (coming soon)</h3>
            <p>Keen to volunteer time, or resources during the crisis? Great! Click through to see where you can help the most people.

            </p>
          </figcaption>
        </OfferCard>
      </a>
      {/* </Link> */}

    </OfferContainer>
  </div>
)

export default CommunitySection
