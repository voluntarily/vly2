
import React from 'react'
import styled from 'styled-components'
import { HalfGrid, H2, H3 } from '../VTheme/VTheme'
import { Button } from 'antd'
const PersonaBox = styled.section`
  margin-bottom: 2rem;
h3 {
  width: 60%;
}

  /* Tablet */
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    h3 {
      width: 80%;
    }
  }

 /* Mobile */
 @media screen and (max-width: 768px) {

  h3 {
      width: 100%;
    }
 }

 /* Mobile */
 @media screen and (max-width: 668px) {
  h3 {
      width: 100%;
    }
 }

 
`

const PersonaContainer = styled.div`
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  margin-bottom: 2rem;
 article {
   margin: 1rem 0;
   display: grid;
   grid-column-gap: 1rem;
   grid-row-gap: 2rem;
    grid-template-columns: 3.5rem 1fr;
 }
 div{ 
   width: 80%;
 }



 /* Mobile */
 @media screen and (max-width: 768px) {

div {
  width: 100%;
}
}



`

const Title = styled.h4`
  height: auto;
  margin: 0.2rem 0 0 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.1px;
  color: black;

  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const Text = styled.p`
  margin: 0rem 0rem 0.5rem 0rem;
  font-size: 1rem;
  font-weight: 400;
  color: black;
  letter-spacing: -0.1px;
  line-height: 24px;

@media screen and (max-width: 1025px) {
width: 90%;
}

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    font-size: 1rem;
    line-height: 1.4;
    height: auto;
    margin-bottom: 1rem;

  }

  @media screen and (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.4;
    height: auto;
    margin-bottom: 1rem;
  }
`

const HowSection = () => (
  <PersonaBox>
    <div>
      <H2>How it works</H2>
      <H3>We add smarts to your volunteering. Voluntarily is an open-source matchmaking platform to connect volunteers who can help with people asking for help.</H3>
    </div>
    <HalfGrid>
      <PersonaContainer>
        <h3>If you ask for help...</h3>
        <article>
          <img src='./static/img/icons/ask3.svg' alt='' />
          <div>
            <Title>Tell volunteers what you are asking for
            </Title>
            <Text>Let volunteers know how they can help you out</Text>
          </div>

          <img src='./static/img/icons/ask2.svg' alt='' />
          <div>
            <Title>Voluntarily finds you volunteers that are keen</Title>
            <Text>Our matchmaking system finds skilled volunteers who want to help you</Text>
          </div>
        </article>

        <Button size='large' shape='round' type='primary'>See all offers</Button>
      </PersonaContainer>

      <PersonaContainer>

        <h3>If you can offer help...</h3>
        <article>
          <img src='./static/img/icons/offer2.svg' alt='' />
          <div>
            <Title>Tell volunteers how you can help
            </Title>
            <Text>Let people know how you can help out in your community</Text>
          </div>

          <img src='./static/img/icons/offer3.svg' alt='' />
          <div>
            <Title>Voluntarily finds you people to help</Title>
            <Text>Offer your knowledge to smaller businesses who need the support to set up remote working.</Text>
          </div>
        </article>

        <Button size='large' shape='round' type='primary'>See all asks</Button>
      </PersonaContainer>

    </HalfGrid>

  </PersonaBox>
)
export default HowSection
