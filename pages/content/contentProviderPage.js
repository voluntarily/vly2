import { Button, Divider } from 'antd'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import SectionTitle from '../../components/LandingPageComponents/SectionTitle'
import { BigQuote, BigQuoteAuthor, FullPage, H1, H3, H3Bold, H4, HalfGrid, P, PBold, Spacer, SpacerSmall, TripleGrid } from '../../components/VTheme/VTheme'


const GridContainer = styled.div`
  position: relative;
  height: auto;
`

const ButtonContainer = styled.div`
  margin-top: 1rem;
`

// const TextHeaderTitle = styled.h1`
//   font-size: 2rem;
//   letter-spacing: -2.2px;
//   font-weight: 700;
//   line-height: 3.5rem;
//   color: black;
//   margin-bottom: 0;
// `

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

const HeroImage = styled.img`
  width: 624px;
  position: relative;
  object-fit: cover;
  height: auto;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    width: calc(50vw - 4rem);
    height: auto;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: calc(50vw - 4rem);
    height: auto;
  }
  @media screen and (max-width: 768px) {
    margin-top: 2rem;
    width: 0;
    height: 0;
  display: none;
  }
`
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
  height: 45rem;
  padding-top: 20rem;
  position: relative;
  padding-bottom: 30rem;
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
  margin-bottom: 10rem;
  margin-top: 10rem;
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

export class ContentProvider extends Component {
  render () {
    return (
      <div>
        <FullPage>
          <Helmet>
            <title>Voluntarily - Business</title>
          </Helmet>
          <HeroContainer>
            <HalfGrid>
              <GridContainer>
                <TextMiniTitle>Voluntarily for Business</TextMiniTitle>
                <H1>Do more social good in your community</H1>
                <H4>

                  Launch gas-powered rockets from rural schools. <br />
                  Get your staff building robots that shoot lazors. <br />
                  Make video games with no prior experience.
                </H4>
                <ButtonContainer>
                  <Button type='primary'>Sign up</Button>&nbsp;&nbsp;
                  <Button>Learn more</Button>
                </ButtonContainer>
              </GridContainer>
              <GridContainer>
                <HeroImage src='/static/img/business/hero2.png' />
              </GridContainer>
            </HalfGrid>
          </HeroContainer>
          <SectionContainer>
            <AboutImage src='/static/test2.png' />
            <H3Bold>
              Enable your staff to become role models for future innovators.
            </H3Bold>
            <H3>
              We help facilitate and automate your corporate social
              responsibility initiatives. Get your staff to teach kids robotics
              by playing maze games and having a good time. See the impact your
              initiatives and resources have on the local community.
            </H3>
          </SectionContainer>
          <SectionContainer>
            <SectionTitle title='We are working with' />
            <SponsorContainer>
              <SponsorIcon src='static/img/partners/Spark.png' />
              <SponsorIcon src='static/img/partners/Westpac.png' />
              <SponsorIcon src='static/img/partners/Datacom.png' />
              <SponsorIcon src='static/img/partners/innovationfund.png' />
              <SponsorIcon src='static/img/partners/MOE.png' />
            </SponsorContainer>
          </SectionContainer>

          <SectionContainer>
            <HalfGrid>
              <GridContainer>
                <ListItemImage src='/static/img/business/item1.png' />
              </GridContainer>
              <GridContainer>
                <AboutListContainer>
                  <H3Bold>Identify talent early</H3Bold>
                  <H3>
                    By deploying staff into schools to train students and
                    teachers, you get first pick of the next generation of
                    talent
                  </H3>
                </AboutListContainer>
              </GridContainer>
            </HalfGrid>
          </SectionContainer>

          <SectionContainer>
            <HalfGrid>
              <GridContainer>
                <ListItemImage src='/static/img/business/item2.png' />
              </GridContainer>
              <GridContainer>
                <AboutListContainer>
                  <H3Bold>
                    Great for employee engagement
                  </H3Bold>
                  <H3>
                    By deploying staff into schools to train students and
                    teachers, you get first pick of the next generation of
                    talent
                  </H3>
                </AboutListContainer>
              </GridContainer>
            </HalfGrid>
          </SectionContainer>

          {/* <SectionContainer>
            <HalfGrid>
              <GridContainer>
              <AboutListContainer>
                  <H3Bold>Great for employee engagement</H3Bold>
                  <H3>
                    By deploying staff into schools to train students and
                    teachers, you get first pick of the next generation of
                    talent
                  </H3>
                </AboutListContainer>
              </GridContainer>
              <GridContainer>
              <ListItemImage />
              </GridContainer>
            </HalfGrid>
          </SectionContainer> */}

          <SectionContainer>
            <HalfGrid>
              <GridContainer>
                <ListItemImage src='/static/img/business/item3.png' />
              </GridContainer>
              <GridContainer>
                <AboutListContainer>
                  <H3Bold>
                    A cheaper way to automate and track your CSR and PR
                    initiatives
                  </H3Bold>
                  <H3>
                    If you have a corporate volunteer day programme, we can make
                    it cheaper to run, and give you hard stats your social
                    impact
                  </H3>
                </AboutListContainer>
              </GridContainer>
            </HalfGrid>
          </SectionContainer>
          <Divider />
          <SectionContainer>
            <BigQuoteContainer>
              <BigQuote>
                &ldquo;Voluntarily made it easier to empower local communities
                and increased volunteer engagement by 90000000%&rdquo;
              </BigQuote>
              <BigQuoteAuthor>Leeeroy Jenkins</BigQuoteAuthor>
              <BigQuoteAuthor>CEO, Westpac Ventures</BigQuoteAuthor>
            </BigQuoteContainer>
          </SectionContainer>
          <Divider />
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

export default ContentProvider
