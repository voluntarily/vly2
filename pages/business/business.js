import React, { Component } from 'react'
import styled from 'styled-components'
import publicPage, { FullPage } from '../../hocs/publicPage'
import { HalfGrid, Spacer } from '../../components/VTheme/VTheme'
import { Button } from 'antd'
import Header from '../../components/Header/Header'
import TitleSectionSub from '../../components/HeroPage/TitleSectionSub'

const GridContainer = styled.div`
height: 25rem;
`

const TextHeaderTitle = styled.h1`

  font-size: 3rem;
  letter-spacing: -3px;
  font-weight: 700;
  line-height: 4rem;
  color: black;
`


const TextMiniTitle = styled.p`
margin-top: 8rem;
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
const FullWidthBlock = styled.div`
width: 80rem;
background-color: black;
height: 60rem;
`

export class Business extends Component {
  render () {
    return (
      <div>
        <FullPage>
          <Spacer />
          <HalfGrid>
            <GridContainer>
              <TextMiniTitle>Voluntarily for Business</TextMiniTitle>
              <TextHeaderTitle>We help your business do more volunteering</TextHeaderTitle>
              <Button>Get involved</Button>&nbsp;&nbsp;<Button>Learn more</Button>
            </GridContainer>
            <GridContainer>
              <HeroImage src='/static/img/business/hero2.png'/>

            </GridContainer>
          </HalfGrid>
          <Spacer />
          <FullWidthBlock>
 
          </FullWidthBlock>
        </FullPage>
      </div>
    )
  }
}

export default publicPage(Business)

