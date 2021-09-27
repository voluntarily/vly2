import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Divider } from 'antd'
import SectionTitle from '../../components/LandingPageComponents/SectionTitle'
import PersonaSection from '../../components/LandingPageComponents/PersonaSection'
import {
  FullPage,
  HalfGrid,
  TextPromo,
  Spacer,
  SpacerSmall,
  SectionContainer

} from '../../components/VTheme/VTheme'

import Hero2 from '../../components/LandingPageComponents/Hero2'
import {
  SponsorContainer,
  SponsorIcon
} from '../../components/LandingPageComponents/Partners'
import styled from 'styled-components'

// annoying hack to make sure buttons dont inherit block width
const ButtonContainer = styled.div`

  @media screen and (max-width: 768px) {
    margin-top: 0;
  }
  button {
    margin-top: 1rem;
  }
`

const TextHeroDescription = styled.h1`
  margin-top: 1rem;

  font-weight: 400;
  font-size: 2.2rem;
  letter-spacing: -1.2px;
  line-height: 1.5;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }
  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
    letter-spacing: -1.1px;
    line-height: 1.5;
    margin-bottom: 6rem;
  }
`
// Page-Specific Images

const AboutImage = styled.img`
  width: 100%;

  margin: 0 auto;
  margin-bottom: 0.5rem;
  object-fit: fill;
  object-position: center;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    margin-top: -8rem;
    width: calc(100vw - 2rem);
    height: auto;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: calc(100vw - 2rem);
    height: auto;
  }
  @media screen and (max-width: 768px) {
    margin-top: 0;
    width: calc(100vw - 2rem);
    height: auto;
  }
`
const ListItemImage = styled.img`
  width: 100%;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    width: calc(45vw - 2rem);
    height: auto;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: calc(45vw - 2rem);
    height: auto;
  }
  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    height: auto;
    order: -2;
  }
`

// Page-Specific Containers

const SectionGridItem = styled.div`
  display: grid;
  align-self: center;
  @media screen and (max-width: 768px) {
    margin-bottom: 4rem;
  }


`

const SectionGridItemLeft = styled.div`
  display: grid;
  align-self: center;
  @media screen and (max-width: 768px) {
    order: -1;
    margin-bottom: 4rem;
  }
`

const ItemContainer = styled.div`

  @media screen and (max-width: 768px) {
    margin-bottom: 2rem;
  }
` // end itemcontainer

export class Business extends Component {
  render () {
    return (
      <div>
        <FullPage>
          <Helmet>
            <title>Voluntarily - for Teachers</title>
          </Helmet>

          <Hero2
            subheader='Voluntarily for Businesses'
            title='Do more social good in your community.'
          />

          <SectionContainer>
            <AboutImage src='/static/test2.png' alt='Photo that shows what the voluntarily website looks like for teachers' />

            <TextHeroDescription>
              <strong>Call in support from experts</strong>
              <br />
              Voluntarily helps teachers get assistance and support in their
              teaching from industry volunteers. All you need to do is list what
              kind of skills you want or need, and volunteers will come.
            </TextHeroDescription>
          </SectionContainer>

          <SectionContainer>
            <HalfGrid>
              <ListItemImage src='static/img/landing-pages/teachers/resources.png' />
              <SectionGridItem>
                <h2>
                  <strong>Free resources</strong>
                </h2>
                <TextPromo>
                  Organize activities in a few clicks with free educational
                  activity templates and resources
                </TextPromo>
                <ButtonContainer>
                  <Button shape='round' size='large'>
                    See resources
                  </Button>
                </ButtonContainer>
              </SectionGridItem>
            </HalfGrid>
          </SectionContainer>

          <SectionContainer>
            <HalfGrid>
              <SectionGridItemLeft>
                <h2>
                  <strong>Bring in Expert Volunteers</strong>
                </h2>
                <TextPromo>
                  Skilled volunteers want to help you out with your teaching by
                  sharing their skills
                </TextPromo>
                <ButtonContainer>
                  <Button shape='round' size='large'>
                    Sign up
                  </Button>
                </ButtonContainer>
              </SectionGridItemLeft>
              <ListItemImage src='static/img/landing-pages/teachers/volunteers.png' />
            </HalfGrid>
          </SectionContainer>

          <Divider />
          <SectionContainer>
            <SectionTitle>We are working with</SectionTitle>
            <SponsorContainer>
              {/* <SponsorIcon src='static/img/partners/MOE.png' /> */}
              <SponsorIcon src='static/img/partners/tec.png' alt='Tertiary Edeucation Commission Logo' />
              <SponsorIcon src='static/img/partners/Spark.png' alt='Spark New Zealand Logo' />
              <SponsorIcon src='static/img/partners/Westpac.png' alt='Westpac Foundation Logo' />
              <SponsorIcon src='static/img/partners/Datacom.png' alt='Datacom Logo' />
              <SponsorIcon src='static/img/partners/innovationfund.png' alt='NZ Innovation Fund Logo' />
              <SponsorIcon src='static/img/partners/ateed.png' alt='Auckland Tourism, Events, and Economic Development Logo Logo' />
              {/* <SponsorIcon src='static/img/partners/xero.png' /> */}
              <SponsorIcon src='static/img/partners/uni.png' alt='University of Auckland ICT Graduate School Logo' />
            </SponsorContainer>
          </SectionContainer>
          <Divider />

          <HalfGrid>
            <ItemContainer>
              <h2>Get involved</h2>
            </ItemContainer>
            <ItemContainer>

              <TextPromo>Voluntarily is currently in beta and will launch soon.<br />Want to join the beta? Sign up below.</TextPromo>
              <ButtonContainer>
                <Button type='primary' size='large' shape='round'>
                  Sign up
                </Button>
              </ButtonContainer>
              <SpacerSmall />

              <ButtonContainer />
            </ItemContainer>
          </HalfGrid>
          <Divider />
          <Spacer />

          <PersonaSection />
        </FullPage>
      </div>
    )
  }
}

export default Business
