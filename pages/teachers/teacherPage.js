import { Button, Divider } from 'antd'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import SectionTitle from '../../components/LandingPageComponents/SectionTitle'
import { BigQuote, BigQuoteAuthor, FullPage, H1, H3, H3Bold, H4, HalfGrid, P, PBold, Spacer, SpacerSmall, TripleGrid } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'



const ButtonContainer = styled.div`
  margin-top: 1rem;
`
const TextHeroTitle = styled.h1`
font-family: Inter-Bold;
font-size: 72px;
color: #000000;
letter-spacing: -4.05px;
line-height: 96px;


@media screen and (min-width: 1026px) and (max-width: 1281px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }
  @media screen and (max-width: 768px) {

  }
`


const TextHeroDescription = styled.h1`
font-weight: 400;
font-size: 2.5rem;
letter-spacing: -1.67px;
line-height: 56px;


@media screen and (min-width: 1026px) and (max-width: 1281px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }
  @media screen and (max-width: 768px) {

  }
`

const TextMiniTitle = styled.p`
  margin-top: 2rem;
  width: 12.8rem;
  color: gray;
  font-size: 1rem;
  letter-spacing: -0.5px;

  font-weight: 400;
  margin-bottom: -0.5rem;
  border-radius: 12px;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }
  @media screen and (max-width: 768px) {
    margin-top: 4rem;
    margin-bottom: 0.5rem;
  }
`
// Page-Specific Images


const AboutImage = styled.img`
  width: 80rem;
  height: 987px;
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
  width: 39rem;
  height: 25rem;
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
  }
`
const SponsorIcon = styled.img`
  object-fit: cover;
  object-position: center;

  height: 10rem;
  width: 10rem;
  @media screen and (max-width: 768px) {
    height: 5rem;
  width: 5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  }
`

// Page-Specific Containers

const HeroContainer = styled.div`

  margin: 10rem 0;
  position: relative;
  
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    padding-top: 8rem;
    padding-bottom: 1rem;
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    padding-top: 4rem;
    padding-bottom: 2rem;
  }

  @media screen and (max-width: 768px) {
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: auto;
  }
`
const SectionContainer = styled.div`
  margin: 10rem 0;
 
  position: relative;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  @media screen and (max-width: 768px) {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    width: calc(100vw - 2rem);
  }
`

const AboutListContainer = styled.div`
  margin-top: 0rem;
  margin-left: 0rem;
`

const BigQuoteContainer = styled.div`
  margin: auto auto;
`

const SponsorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 10rem);
  grid-gap: 4rem;
  @media screen and (max-width: 768px) {

    grid-template-columns: repeat(auto-fit, 5rem);
    grid-gap: 2rem;
    margin-top: 2rem;
    margin-bottom: 4rem;
  }
`

// const CentreTitleContainer = styled.div`
//   width: 40rem;
//   margin: 4rem auto 2rem auto;
//   text-align: center;
// ` // end CentreTitle

const ItemContainer = styled.div`
  height: 10rem;
  @media screen and (max-width: 768px) {
    margin-bottom: 2rem;
  }
` // end itemcontainer

const ItemIcon = styled.img`
  width: 2.5rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
` // end itemIcon

export class Teacher extends Component {
  render () {
    return (
      <div>
        <FullPage>
          <Helmet>
            <title>Voluntarily - for Teachers</title>
          </Helmet>
          <HeroContainer>
     

                <TextMiniTitle>Voluntarily for Teachers</TextMiniTitle>
                <TextHeroTitle>Get industry volunteers to help teachers and students in your school.</TextHeroTitle>
                
                <ButtonContainer>
                  <Button shape='round' size='large' type='primary'>Learn More</Button>&nbsp;&nbsp;
                  <Button shape='round' size='large' >Teacher Sign up</Button>
                </ButtonContainer>
    
          </HeroContainer>
          <SectionContainer>
            <AboutImage src='/static/test2.png' />
   
                  <TextHeroDescription>
                  Voluntarily helps teachers get assistance and support in their teaching from industry volunteers. All you need to do is list 
what kind of skills you want or need, and volunteers will come.
                  </TextHeroDescription>
          </SectionContainer>
          <SectionContainer>
          <HalfGrid>
            <img src='static/img/landing-pages/teachers/resources.png'/>
            <div>aaaaa</div>
          </HalfGrid>

          </SectionContainer>
          <SectionContainer>
            <h3> We are working with</h3>
            <SponsorContainer>
              <SponsorIcon src='static/img/partners/Spark.png' />
              <SponsorIcon src='static/img/partners/Westpac.png' />
              <SponsorIcon src='static/img/partners/Datacom.png' />
              <SponsorIcon src='static/img/partners/innovationfund.png' />
              <SponsorIcon src='static/img/partners/MOE.png' />
              <SponsorIcon src='static/img/partners/MOE.png' />
              <SponsorIcon src='static/img/partners/innovationfund.png' />
              <SponsorIcon src='static/img/partners/MOE.png' />
              <SponsorIcon src='static/img/partners/MOE.png' />              

            </SponsorContainer>
          </SectionContainer>
         
          <SectionTitle title='Features' />
          <TripleGrid>
            <ItemContainer>
              <ItemIcon src='/static/img/icons/search.svg' />
              <PBold>Volunteering Management</PBold>
              <P>
                V provides you and your staff with an easy way to find schools
                and charities that need help with tech.{' '}
              </P>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='/static/img/icons/search.svg' />
              <PBold>Impact reporting</PBold>
              <P>
                V measures the impact your actions have on New Zealand. See how
                your business ranks in social impact on our leaderboard.
              </P>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='/static/img/icons/search.svg' />
              <PBold>HR system integration</PBold>
              <P>
                V supports single sign on, so you don't have to remember extra
                credentials if you're a large corp
              </P>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='/static/img/icons/search.svg' />
              <PBold>Automated police vetting</PBold>
              <P>
                V provides you and your staff with an easy way to find schools
                and charities that need help with tech.
              </P>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='/static/img/icons/search.svg' />
              <PBold>Cause Targeting</PBold>
              <P>
                Our systems enable you to target specific causes you want to
                support
              </P>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='/static/img/icons/search.svg' />
              <PBold>Integration</PBold>
              <P>
                V supports single sign on, so you don't have to remember extra
                credentials if you're a large corp
              </P>
            </ItemContainer>
          </TripleGrid>
          <Spacer />
          <Divider />

          <SectionTitle title='How to get involved' />
          <HalfGrid>
            <ItemContainer>
              <H3>Sign up for updates</H3>
              <SpacerSmall />
              <P>Voluntarily is currently in beta and will launch soon.</P>
              <ButtonContainer>
                <Button type='primary' size='large'>
                  Sign up
                </Button>
              </ButtonContainer>
            </ItemContainer>
            <ItemContainer>
              <H3>Contact us</H3>
              <SpacerSmall />
              <P>
                Want to get more involved in the project? Get in touch below.
              </P>
              <br />
              <a>business@voluntarily.nz</a>
              <br />
              <br />
              <a>+64-9-123-4567</a>
              <ButtonContainer />
            </ItemContainer>
          </HalfGrid>
        </FullPage>
      </div>
    )
  }
}

export default publicPage(Teacher)
