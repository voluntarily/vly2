import React from 'react'
import styled from 'styled-components'
// import { FormattedMessage } from 'react-intl'
import { Grid } from '../VTheme/VTheme'
import { Button } from 'antd'

const PersonaBox = styled.div`
  margin-bottom: 8rem;
  @media screen and (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

const PersonaContainer = styled.div`
  width: 18.5rem;
  position: relative;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    height: auto;
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    height: auto;
  }
  @media screen and (max-width: 768px) {

    height: auto;
    margin-bottom: 3rem;
  }


@media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
/* iPhone X */
width: calc(100vw - 2rem);
height: auto;
}

  @media screen and (max-width: 480px) {
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


@media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
/* iPhone X */
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

  
@media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
/* iPhone X */
font-size: 1rem;
    line-height: 1.4;
    width: calc(90vw - 2rem);
    height: auto;
    margin-bottom: 1rem;
}

  @media screen and (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.4;
    width: calc(90vw - 2rem);
    height: auto;
    margin-bottom: 1rem;
  }
`

const AboutSection = () => (
  <PersonaBox>
    <Grid>
      <a href='/about' target='_blank'>
        <PersonaContainer>
          <Image src='/static/img/volunteerCard.png' />
          <Title>Volunteers</Title>
          <Text>
            Discover cool opportunities to help out teachers, students and
            charities.
          </Text>
          <Button>Learn More</Button>
        </PersonaContainer>
      </a>
      <a href='/teachers' target='_blank'>
        <PersonaContainer>
          <Image src='/static/img/teacherCard.png' />
          <Title>Teachers</Title>
          <Text>
            Get the help of skilled volunteers to bring tech to your teaching.
          </Text>
          <Button>Learn More</Button>
        </PersonaContainer>
      </a>
      <a href='/content' target='_blank'>
        <PersonaContainer>
          <Image src='/static/img/contentCard.png' />
          <Title>Content Providers</Title>
          <Text>We help you get more people involved with your movement.</Text>
          <Button>Learn More</Button>
        </PersonaContainer>
      </a>
      <a href='/business' target='_blank'>
        <PersonaContainer>
          <Image src='/static/img/businessCard.png' />
          <Title>Businesses</Title>
          <Text>
            We handle HR, admin, and discovery so your staff have more impact on
            the community.
          </Text>
          <Button>Learn More</Button>
        </PersonaContainer>
      </a>
    </Grid>
  </PersonaBox>
)
export default AboutSection
