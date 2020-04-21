
import React from 'react'
import styled from 'styled-components'

import { Grid, HeroSectionHeader, HeroSectionButtonContainer } from '../VTheme/VTheme'
import { Button } from 'antd'
const PersonaBox = styled.section`
  margin-bottom: 2rem;

 
  @media screen and (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

const PersonaContainer = styled.div`
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  margin-bottom: 2rem;

  :hover {
    border-radius: 8px;
    transform: scale(1.04);
 


  }

`
const Image = styled.img`
  width: 100%;
  object-fit: cover;



  @media screen and (max-width: 768px) {
    height: 20rem;
    object-position: top;
  }

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
  /* iPhone X */
  height: 20rem;
  object-position: top;
  }
`

const Title = styled.h3`
  height: auto;
  margin: 0.2rem 0 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.1px;
  color: black;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const Text = styled.p`
  margin: 0rem 0rem 0.5rem 0rem;
  font-size: 1rem;
  font-weight: 400;
  color: black;
  letter-spacing: -0.1px;
  line-height: 24px;

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

const TakeSupportSection = () => (
  <PersonaBox>
    <HeroSectionHeader>
      <h2>How people can support you</h2>
      <HeroSectionButtonContainer>
        <Button type='secondary' href='/a/ask' size='large' shape='round' block>See all Activities</Button>
      </HeroSectionButtonContainer>
    </HeroSectionHeader>
    <Grid>

      <PersonaContainer>
        <Image src='./static/img/landingcards/RemoteWorking.png' alt='' />
        <Title>Suddenly working remotely?</Title>
        <Text>Find someone to tell you all about remote working apps, and tips for working from home efficiently.</Text>
      </PersonaContainer>

      <PersonaContainer>
        <Image src='./static/img/landingcards/SchoolClosed.png' alt='' />
        <Title>School closed?</Title>
        <Text>Talk to educators who can guide you to platforms and resources to help you keep teaching or learning online.</Text>
      </PersonaContainer>

      <PersonaContainer>
        <Image src='./static/img/landingcards/Isolation.png' alt='' />
        <Title>Self isolating and struggling?</Title>
        <Text>Meet someone who can help you run errands, check in on you, or just someone to talk to. </Text>
      </PersonaContainer>

      <PersonaContainer>
        <Image src='./static/img/landingcards/ElderlyRisk.png' alt='' />
        <Title>Over seventy?</Title>
        <Text>Or worried about an over seventy? Find someone to check in to make isolation a little less lonely.</Text>
      </PersonaContainer>
    </Grid>

  </PersonaBox>
)
export default TakeSupportSection
