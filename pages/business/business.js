import React, { Component } from 'react'
import styled from 'styled-components'
import publicPage, { FullPage } from '../../hocs/publicPage'
import {
  HalfGrid,
  Spacer,
  TextH1,
  TripleGrid,
  TextHeading,
  TextP,
  TextPBold,
  SpacerSmall
} from '../../components/VTheme/VTheme'
import { Button, Divider } from 'antd'
import TitleSection from '../../components/LandingPageComponents/TitleSection'

const GridContainer = styled.div`
  height: 25rem;
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
  margin-top: 4rem;
  width: 12.8rem;
  color: black;
  font-size: 1rem;
  letter-spacing: -0.5px;

  font-weight: 400;
  margin-bottom: 0.5rem;
  border-radius: 12px;
`

const HeroImage = styled.img`
  width: 624px;
  object-fit: cover;
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
          <Spacer />
          <HalfGrid>
            <GridContainer>
              <TextMiniTitle>Voluntarily for Business</TextMiniTitle>
              <TextH1>We help your business do more volunteering</TextH1>
              <ButtonContainer>
                <Button>Get involved</Button>&nbsp;&nbsp;
                <Button>Learn more</Button>
              </ButtonContainer>
            </GridContainer>
            <GridContainer>
              <HeroImage src='/static/img/business/hero2.png' />
            </GridContainer>
          </HalfGrid>
          <Spacer />
          <Divider />
          <TitleSection title='How we help you' />
          <TripleGrid>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>Visibility</TextPBold>
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
              <TextPBold>Integration</TextPBold>
              <TextP>
                V supports single sign on, so you don't have to remember extra
                credentials if you're a large corp
              </TextP>
            </ItemContainer>
            <ItemContainer>
              <ItemIcon src='./static/img/icons/search.svg' />
              <TextPBold>Visibility</TextPBold>
              <TextP>
                V provides you and your staff with an easy way to find schools
                and charities that need help with tech.
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
              <TextHeading>Get in touch</TextHeading>
              <SpacerSmall />
              <TextP>Ready to get your business involved?</TextP>
              <ButtonContainer>
                <Button type='secondary'>Send a Message</Button>
              </ButtonContainer>
            </ItemContainer>
            <ItemContainer>
              <TextHeading>Schedule a call</TextHeading>
              <SpacerSmall />
              <TextP>Ready to get your business involved? </TextP>
              <ButtonContainer>
                <Button type='secondary'>Schedule a call</Button>
              </ButtonContainer>
            </ItemContainer>
          </HalfGrid>
        </FullPage>
      </div>
    )
  }
}

export default publicPage(Business)
