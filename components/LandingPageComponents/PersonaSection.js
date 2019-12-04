import { Button, Row, Col } from 'antd'
import React from 'react'
import styled from 'styled-components'

const PersonaBox = styled.div`
  margin-bottom: 8rem;
  padding: 1rem;
 
  @media screen and (max-width: 768px) {
    margin-bottom: 2rem;
  }
`

const PersonaContainer = styled.div`
  margin-bottom: 2rem;

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
  font-size: 1rem;
  font-weight: 400;
  color: black;
  letter-spacing: -0.6px;
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

const AboutSection = () => (
  <PersonaBox>
    <Row gutter={[32, 32]}>
      <Col sm={12} lg={6}>
        <a href='/about' target='_blank' rel='noopener noreferrer'>
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
      </Col>
      <Col sm={12} lg={6}>
        <a href='/teachers' target='_blank' rel='noopener noreferrer'>
          <PersonaContainer>
            <Image src='/static/img/teacherCard.png' />
            <Title>Teachers</Title>
            <Text>
              Get the help of skilled volunteers to bring tech to your teaching.
            </Text>
            <Button>Learn More</Button>
          </PersonaContainer>
        </a>
      </Col>
      <Col sm={12} lg={6}>
        <a href='/content' target='_blank' rel='noopener noreferrer'>
          <PersonaContainer>
            <Image src='/static/img/contentCard.png' />
            <Title>Content Providers</Title>
            <Text>We help you get more people involved with your movement.</Text>
            <Button>Learn More</Button>
          </PersonaContainer>
        </a>
      </Col>
      <Col sm={12} lg={6}>
        <a href='/business' target='_blank' rel='noopener noreferrer'>
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
      </Col>
    </Row>
  </PersonaBox>
)
export default AboutSection
