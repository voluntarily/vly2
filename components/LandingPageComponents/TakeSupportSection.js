
import React from 'react'
import styled from 'styled-components'

import { Grid, HeroSectionHeader } from '../VTheme/VTheme'
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
      <h2>Suddenly working remotely?</h2>
      <Button type='secondary' size='large' shape='round'>aaaaa</Button>
    </HeroSectionHeader>
    <Grid>

      <PersonaContainer>
        <Image src='./static/img/landingcards/RemoteWorking.png' alt='' />
        <Title>School closed?</Title>
        <Text>Offer your knowledge to smaller businesses who need the support to set up remote working.</Text>
      </PersonaContainer>

      <PersonaContainer>
        <Image src='./static/img/landingcards/SchoolClosed.png' alt='' />
        <Title>Over seventy?</Title>
        <Text>Spread your kindness and offer help to those that cannot leave their homes.</Text>
      </PersonaContainer>

      <PersonaContainer>
        <Image src='./static/img/landingcards/Isolation.png' alt='' />
        <Title>Help teachers</Title>
        <Text>Help teachers create a distance learning plan for their kura or school. </Text>
      </PersonaContainer>

      <PersonaContainer>
        <Image src='./static/img/landingcards/ElderlyRisk.png' alt='' />
        <Title>Help seniors</Title>
        <Text>Reach out to our most at-risk citizens and help look out for those over 70.</Text>
      </PersonaContainer>
    </Grid>

  </PersonaBox>
)
export default TakeSupportSection
