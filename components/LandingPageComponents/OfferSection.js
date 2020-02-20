import React from 'react'
import styled from 'styled-components'


import { FormattedMessage } from 'react-intl'
import SectionTitle from '../../components/LandingPageComponents/SectionTitle'


const OfferContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
gap: 2rem;
margin-bottom: 8rem;
`

const OfferCard = styled.div`
box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
height: 10rem;
background-color: pink;
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
        
        <OfferCard></OfferCard>
        <OfferCard></OfferCard>
        <OfferCard></OfferCard>
        

    </OfferContainer>
    </div>
)

export default OfferSection