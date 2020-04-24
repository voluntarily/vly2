
import React from 'react'
import styled from 'styled-components'
import { HalfGrid } from '../VTheme/VTheme'

const PersonaBox = styled.section`
  margin-bottom: 2rem;
  h3 {
    font-size: 1.5rem;
    width: 60%;
    font-weight: 400;
    letter-spacing: -0.3px;
    color: #333;
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
const PersonaHeader = styled.div`
  h2 {
    font-size: 3rem;
    margin-bottom: 0;
    font-weight: 400;
  }

  /* Tablet */
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    h2 {
    font-size: 2rem;
  }

 /* Mobile */
 @media screen and (max-width: 768px) {

  h2 {
    font-size: 2rem;
  }
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

const Title = styled.h4`
  height: auto;
  margin: 0.2rem 0 0 0;
  font-size: 1rem;
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

const HowSection = () => (
  <PersonaBox>
    <PersonaHeader>
      <h2>How it works</h2>
      <h3>We add smarts to your volunteering. Voluntarily is an open-source matchmaking platform to connect volunteers who can help with people asking for help.</h3>
    </PersonaHeader>
    <HalfGrid>
      <PersonaContainer>
        <h3>If you ask for help...</h3>
        <Title>Help small businesses</Title>
        <Text>Offer your knowledge to smaller businesses who need the support to set up remote working.</Text>
      </PersonaContainer>

      <PersonaContainer>

        <h3>If you can offer help...</h3>
        <Title>Help your community</Title>
        <Text>Spread your kindness and offer help to those that cannot leave their homes.</Text>
      </PersonaContainer>

    </HalfGrid>

  </PersonaBox>
)
export default HowSection
