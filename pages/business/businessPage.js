import React, { Component } from 'react'
import styled from 'styled-components'
import publicPage, { FullPage } from '../../hocs/publicPage'
import {
  HalfGrid,
  Spacer,
  TextH1,
  TripleGrid,
  TextHeading,
  TextHeadingBold,
  TextP,
  TextPBold,
  SpacerSmall,
  TextSubtitle,
  BigQuote,
  BigQuoteAuthor,
  TextH3
} from '../../components/VTheme/VTheme'
import { Button, Divider } from 'antd'
import TitleSection from '../../components/LandingPageComponents/TitleSection'

const GridContainer = styled.div`
  position: relative;
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
`
// Page-Specific Images

const HeroImage = styled.img`
  width: 624px;
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
    margin-top: -8rem;
    width: calc(50vw - 4rem);
    height: auto;
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
    width: calc(100vw - 4rem);
    height: auto;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: calc(100vw - 4rem);
    height: auto;
  }
  @media screen and (max-width: 768px) {
    margin-top: -8rem;
    width: calc(100vw - 4rem);
    height: auto;
  }
`
const ListItemImage = styled.img`
  width: 39rem;
  height: 25rem;
  background-color: black;
`
const SponsorIcon = styled.img`
  object-fit: cover;
  object-position: center;
  background-color: black;
  height: 10rem;
  width: 10rem;
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
  }

  @media screen and (max-width: 768px) {
  }
`
const SectionContainer = styled.div`
  margin-bottom: 10rem;
  margin-top: 10rem;
  position: relative;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
`

const AboutListItem = styled.div`
  margin-bottom: 5rem;
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
`

// const CentreTitleContainer = styled.div`
//   width: 40rem;
//   margin: 4rem auto 2rem auto;
//   text-align: center;
// ` // end CentreTitle

const ItemContainer = styled.div`
  height: 10rem;
` // end itemcontainer

const ItemIcon = styled.img`
  width: 2.5rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
` // end itemIcon

export class Business extends Component {
  render () {
    return (
      <div>
        <FullPage>
          <HeroContainer>
            <HalfGrid>
              <GridContainer>
                <TextMiniTitle>Voluntarily for Business</TextMiniTitle>
                <TextH1>Do more social good in your community</TextH1>
                <TextSubtitle>
                  <br />
                  Launch gas-powered rockets from rural schools. <br />
                  Get your staff building robots that shoot lazors. <br />
                  Make video games with no prior experience.
                </TextSubtitle>
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
            <AboutImage src='./static/test2.png' />
            <TextHeadingBold>
              Enable your staff to become role models for future innovators.
            </TextHeadingBold>
            <TextHeading>
              We help facilitate and automate your corporate social
              responsibility initiatives. Get your staff to teach kids robotics
              by playing maze games and having a good time. See the impact your
              initiatives and resources have on the local community.
            </TextHeading>
          </SectionContainer>
          <SectionContainer>
            <TitleSection title='In partnership with...' />
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
                  <TextHeadingBold>Identify talent early</TextHeadingBold>
                  <TextHeading>
                    By deploying staff into schools to train students and
                    teachers, you get first pick of the next generation of
                    talent
                  </TextHeading>
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
                  <TextHeadingBold>
                    Great for employee engagement
                  </TextHeadingBold>
                  <TextHeading>
                    By deploying staff into schools to train students and
                    teachers, you get first pick of the next generation of
                    talent
                  </TextHeading>
                </AboutListContainer>
              </GridContainer>
            </HalfGrid>
          </SectionContainer>

          {/* <SectionContainer>
            <HalfGrid>
              <GridContainer>
              <AboutListContainer>
                  <TextHeadingBold>Great for employee engagement</TextHeadingBold>
                  <TextHeading>
                    By deploying staff into schools to train students and
                    teachers, you get first pick of the next generation of
                    talent
                  </TextHeading>
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
                  <TextHeadingBold>
                    A cheaper way to automate and track your CSR and PR
                    initiatives
                  </TextHeadingBold>
                  <TextHeading>
                    If you have a corporate volunteer day programme, we can make
                    it cheaper to run, and give you hard stats your social
                    impact
                  </TextHeading>
                </AboutListContainer>
              </GridContainer>
            </HalfGrid>
          </SectionContainer>

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
          <TitleSection title='Features' />
          <TripleGrid>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>Volunteering Management</TextPBold>
              <TextP>
                V provides you and your staff with an easy way to find schools
                and charities that need help with tech.{' '}
              </TextP>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>Impact reporting</TextPBold>
              <TextP>
                V measures the impact your actions have on New Zealand. See how
                your business ranks in social impact on our leaderboard.
              </TextP>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>HR system integration</TextPBold>
              <TextP>
                V supports single sign on, so you don't have to remember extra
                credentials if you're a large corp
              </TextP>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>Automated police vetting</TextPBold>
              <TextP>
                V provides you and your staff with an easy way to find schools
                and charities that need help with tech.
              </TextP>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>Cause Targeting</TextPBold>
              <TextP>
                Our systems enable you to target specific causes you want to
                support
              </TextP>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>Integration</TextPBold>
              <TextP>
                V supports single sign on, so you don't have to remember extra
                credentials if you're a large corp
              </TextP>
            </ItemContainer>
          </TripleGrid>
          <Spacer />
          <Divider />

          <TitleSection title='How to get started' />
          <HalfGrid>
            <ItemContainer>
              <TextHeading>Create an account</TextHeading>
              <SpacerSmall />
              <TextP>It takes a few minutes to get started volunteering.</TextP>
              <ButtonContainer>
                <Button type='primary' size='large'>
                  Sign up
                </Button>
              </ButtonContainer>
            </ItemContainer>
            <ItemContainer>
              <TextHeading>Contact us</TextHeading>
              <SpacerSmall />
              <TextP>
                Get help setting up an account by getting in touch. We have
                people ready to help you standing by :)
              </TextP>
              <br />
              <a>business@voluntari.ly</a>
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

export default publicPage(Business)
