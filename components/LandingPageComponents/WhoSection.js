
import React from 'react'
import styled from 'styled-components'
import { H2, TripleGrid, HeroText, HeroItemStatic } from '../VTheme/VTheme'
import { FormattedMessage } from 'react-intl'

const PersonaBox = styled.section`
@media screen and (max-width: 1300px) {
  margin: 0 1rem;
}
 
`

const PersonaHeader = styled.div`
margin: 4rem 0;
text-align: center;

h2 {
  font-weight: 700;
  
}

@media screen and (max-width: 768px) {
  margin-top: 2rem;
}
`
const ComingSoonTag = styled.p`
position: absolute;
z-index: 1200;
background-color: black;
padding: 0.5rem 1rem;
border-radius: 120px;
font-weight: 700;
color: white;
font-size: 1.2rem;


`

const WhoSection = () => (
  <PersonaBox>
    <PersonaHeader>
      <H2>Who we help</H2>
    </PersonaHeader>
    <TripleGrid>
      <HeroItemStatic>

        <HeroText>
          <h1>
            <FormattedMessage
              id='who.title.schools'
              defaultMessage='Schools'
            />
          </h1>
          <p>
            <FormattedMessage
              id='who.body.schools'
              defaultMessage='Connect your class or school with industry volunteers and experts'
            />
          </p>

        </HeroText>
        <img src='/static/img/landing-pages/school.png' />
      </HeroItemStatic>
      <HeroItemStatic>
        <ComingSoonTag>Coming Soon</ComingSoonTag>
        <HeroText>
          <h1>
            <FormattedMessage
              id='who.title.communities'
              defaultMessage='Communities'
            />
          </h1>
          <p>
            <FormattedMessage
              id='who.body.communities'
              defaultMessage='White label the site to manage your volunteers safely'
            />
          </p>

        </HeroText>
        <img src='/static/img/landing-pages/community.png' />
      </HeroItemStatic>
      <HeroItemStatic>
        <ComingSoonTag>Coming Soon</ComingSoonTag>
        <HeroText>
          <h1>
            <FormattedMessage
              id='who.title.business'
              defaultMessage='Small businesses '
            />
          </h1>
          <p>
            <FormattedMessage
              id='who.body.business'
              defaultMessage='Connect with experts to mentor and give free advice'
            />
          </p>

        </HeroText>
        <img src='/static/img/landing-pages/business.png' />
      </HeroItemStatic>
    </TripleGrid>

  </PersonaBox>
)
export default WhoSection
