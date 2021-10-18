import { Button, Row, Col } from 'antd'
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import SectionTitle from '../../components/Landing/SectionTitle'
const PersonaBox = styled.section`
  margin-bottom: 4rem;

 
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
    h3 {
      color: #6549AA;
    }


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
  letter-spacing: -0.85px;
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
    <SectionTitle>
      <FormattedMessage
        id='landing.sectiontitle.persona'
        defaultMessage='Who we help'
        description='Title for the section that describes who we help'
      />
    </SectionTitle>
    <Row gutter={[32, 32]}>
      <Col sm={12} lg={6}>
        <Link href='/about' target='_blank' rel='noopener noreferrer' passHref>
          <PersonaContainer>
            <Image src='/static/img/volunteerCard.png' alt={<FormattedMessage id='PersonaVolunteers' defaultMessage='Volunteers' description='volunteers' />} />
            <Title><FormattedMessage id='PersonaVolunteers' defaultMessage='Volunteers' description='volunteers' /></Title>
            <Text>
              <FormattedMessage id='PersonaVolunteersDescription' defaultMessage='Discover cool opportunities to help out teachers, students and charities.' description='promo description for volunteers' />
            </Text>
            <Button><FormattedMessage id='LearnMore' defaultMessage='Learn More' description='Learn more button' /></Button>
          </PersonaContainer>
        </Link>
      </Col>
      <Col sm={12} lg={6}>
        <Link href='/teachers' target='_blank' rel='noopener noreferrer' passHref>
          <PersonaContainer>
            <Image src='/static/img/teacherCard.png' alt={<FormattedMessage id='PersonaTeachers' defaultMessage='Teachers' description='teachers' />} />
            <Title><FormattedMessage id='PersonaTeachers' defaultMessage='Teachers' description='teachers' /></Title>
            <Text>
              <FormattedMessage id='PersonaTeachersDescription' defaultMessage='Get the help of skilled volunteers to bring tech to your teaching.' description='description for teacher promo card' />

            </Text>
            <Button><FormattedMessage id='LearnMore' defaultMessage='Learn More' description='Learn more button' /></Button>
          </PersonaContainer>
        </Link>
      </Col>
      <Col sm={12} lg={6}>
        <Link href='/content' target='_blank' rel='noopener noreferrer' passHref>
          <PersonaContainer>
            <Image src='/static/img/contentCard.png' alt={<FormattedMessage id='PersonaContent' defaultMessage='Content Creators' description='Content Creators' />} />
            <Title><FormattedMessage id='PersonaContent' defaultMessage='Content Creators' description='Content Creators' /></Title>
            <Text><FormattedMessage id='PersonaContentDescription' defaultMessage='We help you get more people involved with your content.' description='description content for Content Creators' /></Text>
            <Button><FormattedMessage id='LearnMore' defaultMessage='Learn More' description='Learn more button' /></Button>
          </PersonaContainer>
        </Link>
      </Col>
      <Col sm={12} lg={6}>
        <Link href='/business' target='_blank' rel='noopener noreferrer' passHref>
          <PersonaContainer>
            <Image src='/static/img/businessCard.png' alt={<FormattedMessage id='PersonaBusiness' defaultMessage='Businesses' description='Businesses' />} />
            <Title><FormattedMessage id='PersonaBusiness' defaultMessage='Businesses' description='Businesses' /></Title>
            <Text>
              <FormattedMessage id='PersonaBusinessDescription' defaultMessage='We handle HR, admin, and discovery so your staff have more impact on the community.' description='Description content for businesses' />
            </Text>
            <Button><FormattedMessage id='LearnMore' defaultMessage='Learn More' description='Learn more button' /></Button>
          </PersonaContainer>
        </Link>
      </Col>
    </Row>
  </PersonaBox>
)
export default AboutSection
