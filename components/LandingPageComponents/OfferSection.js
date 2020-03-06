import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import SectionTitle from '../../components/LandingPageComponents/SectionTitle'

const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 8rem;
  @media screen and (min-width: 1026px) and (max-width: 1289px) {
    grid-template-columns: 1fr 1fr 1fr;

  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const OfferCard = styled.div`
width: 100%;
min-height: 25rem;
  background: #ffffff;
  box-shadow: 2px 2px 16px 0 rgba(118, 118, 118, 0.5);
  border-radius: 8px;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  figcaption {
    padding: 1rem;
  }

  h3 {
    bottom: 0;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: -0.38px;
    line-height: 32px;

    margin-bottom: 0.5rem;
  }


  p {
    font-size: 1.1rem;
  }
 
  img {
    border-radius: 8px;
    width: 100%;
    @media screen and (max-width: 768px) {
    height: 14rem;
  }
  }

  :hover {
    transform: scale(1.05);
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

const OfferSection = () => (
  <div>
    <SectionTitle>
      <FormattedMessage
        id='landing.sectiontitle.offers'
        defaultMessage='What we offer'
      />
    </SectionTitle>
    <OfferContainer>
      <Link href='/search'>
        <a>

          <OfferCard>
            <img src='/static/img/offers/volunteering.png' />
            <figcaption>
              <h3>Volunteering</h3>
              <p>
            Use your skills by volunteering to work with teachers and students
            in schools
              </p>
            </figcaption>
          </OfferCard>
        </a>
      </Link>
      <Link href='/act'>
        <a>
          <OfferCard>

            <img src='/static/img/offers/resources.png' />
            <figcaption>
              <h3>Resources</h3>
              <p>
            Organize activities with volunteers for students in a few clicks with educational
            activity templates and resources
              </p>
            </figcaption>
          </OfferCard>
        </a>
      </Link>
      <OfferCard>

        <img src='/static/img/offers/recognition.png' />
        <figcaption>
          <h3>Recognition</h3>
          <p>
            Get recognised for your volunteering when you use Voluntarily.{' '}
            <i>(Coming soon)</i>
          </p>
        </figcaption>
      </OfferCard>
    </OfferContainer>
  </div>
)

export default OfferSection
