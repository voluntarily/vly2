import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Grid from '../../components/VTheme/VTheme'

const PersonaContainer = styled.div`
  width: 18.5rem;
  position: relative;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {

  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    height: auto;
    margin-bottom: 4rem;

  }
`

const Image = styled.img`
  width: 100%;
  object-fit: cover;
`

const Title = styled.div`
    height: auto;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.95px;
  color: black;
  @media screen and (max-width: 768px) {
    font-size: 2rem

  }
`

const Text = styled.div`
    height: auto;
  margin: 0rem 0rem 0rem 0rem;
  height: 3rem;
  width: 16.5rem;
  font-size: 1rem;
  font-weight: 400;
  color: black;
  letter-spacing: -0.6px;
  line-height: 24px;

  @media screen and (max-width: 768px) {
    font-size: 2rem

  }
`

const AboutSection = () => (
  <Grid>
    <PersonaContainer>
        <Image src="/static/img/volunteerCard.png"/>
        <Title>Volunteers</Title>
        <Text>Discover cool opportunities to help out teachers, students and charities.</Text>
        <a href="#">Browse Activities</a>
    </PersonaContainer>
    <PersonaContainer>
        <Image src="/static/img/teacherCard.png"/>
        <Title>Educators</Title>
        <Text>Get the help of skilled volunteers to bring tech to your teaching.</Text>
        <a href="#">Learn More</a>
    </PersonaContainer>
    <PersonaContainer>
        <Image src="/static/img/contentCard.png"/>
        <Title>Charities</Title>
        <Text>We help you get more people involved with your movement.</Text>
        <a href="#">Learn More</a>
    </PersonaContainer>
    <PersonaContainer>
        <Image src="/static/img/businessCard.png"/>
        <Title>Businesses</Title>
        <Text>We handle the admin so your people have a better time volunteering.</Text>
        <a href="#">Learn More</a>
    </PersonaContainer>

  </Grid>
)
export default AboutSection
