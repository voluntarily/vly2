import React from 'react'
import styled from 'styled-components'
// import { FormattedMessage } from 'react-intl'
import { Grid } from '../VTheme/VTheme'
import { Button } from 'antd'

const PersonaContainer = styled.a`
  width: 18.5rem;
  position: relative;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    height: auto;
    margin-bottom: 3rem;
  }

  :hover {
    -webkit-transition: all 0.3s;
    transition: all 0.3s;

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
`

const Title = styled.div`
  height: auto;
  margin: 0.2rem 0 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.85px;
  color: black;
  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const Text = styled.div`
  margin: 0rem 0rem 0.5rem 0rem;

  width: 16.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: black;
  letter-spacing: -0.6px;
  line-height: 24px;

  @media screen and (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.4;
    width: calc(90vw - 2rem);
    height: auto;
    margin-bottom: 1rem;
  }
`

const AboutSection = () => (
  <Grid>
    <PersonaContainer href='/about' target='_blank'>
      <Image src='/static/img/volunteerCard.png' />
      <Title>Volunteers</Title>
      <Text>
        Discover cool opportunities to help out teachers, students and
        charities.
      </Text>
      <Button href='/about'>Learn More</Button>
    </PersonaContainer>
    <PersonaContainer href='/educators' target='_blank'>
      <Image src='/static/img/teacherCard.png' />
      <Title>Educators</Title>
      <Text>
        Get the help of skilled volunteers to bring tech to your teaching.
      </Text>
      <Button href='/educators'>Learn More</Button>
    </PersonaContainer>
    <PersonaContainer href='/charities' target='_blank'>
      <Image src='/static/img/contentCard.png' />
      <Title>Charities</Title>
      <Text>We help you get more people involved with your movement.</Text>
      <Button href='/charities'>Learn More</Button>
    </PersonaContainer>
    <PersonaContainer href='/business' target='_blank'>
      <Image src='/static/img/businessCard.png' />
      <Title>Businesses</Title>
      <Text>
        We handle HR, admin, and discovery so your staff have more impact on the
        community.
      </Text>
      <Button href='/business'>Learn More</Button>
    </PersonaContainer>
  </Grid>
)
export default AboutSection
