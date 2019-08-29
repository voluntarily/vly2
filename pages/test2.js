import React, { Component } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import publicPage from '../hocs/publicPage'
import TitleSectionSub from '../components/LandingPageComponents/TitleSectionSub'
import { FullPage } from '../../components/VTheme/VTheme'

const FullPage2Grid = styled.div`
  width: 100vw;

  display: grid;
  grid-gap: 0;
  grid-template-columns: 50vw 50vw;
`
const FullBlock = styled.div`
  width: 100vw;
  height: 40rem;
  background-color: #6549aa;
`

const FullBlockMid = styled.div`
  text-align: center;
  position: relative;
  padding-top: 8rem;
`

const HalfContainer = styled.div`
  /* background-color: yellow;
  border: 3px solid red; */
  width: 50vw;
`

const LeftAlign = styled.div`
  top: 18rem;
  position: relative;
  margin-left: 4rem;
  margin-right: 4rem;
`
const HeaderLol = styled.h1`
  font-size: 3rem;
  letter-spacing: -2.2px;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const HeaderMid = styled.h1`
  font-size: 6rem;
  letter-spacing: -7px;
  font-weight: 700;
  line-height: 400px;
  color: white;
`

const MiniTitle = styled.p`
  width: 12.8rem;
  color: black;
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 0;
  border-radius: 12px;
`
const SideImage = styled.img`
  width: 100%;
  height: 50rem;
  background-color: black;
  object-fit: cover;
  object-position: center;
`

export class Test2 extends Component {
  render () {
    return (
      <div>
        <FullPage2Grid>
          <HalfContainer>
            <LeftAlign>
              <MiniTitle>Voluntarily for Business</MiniTitle>
              <HeaderLol>We help your business volunteer 🥳</HeaderLol>
              <p>
                V takes away the pain of organising and managing your CSR
                initiatives. We help find your people cool ways to help out
                around the community. We also provide you reporting and impact
                metrics around how they improve society.
              </p>
              <Button type='primary'>Learn more</Button>{' '}
              <Button>Sign up</Button>
            </LeftAlign>
          </HalfContainer>
          <HalfContainer>
            <SideImage src='/static/img/business/hero.png' />
          </HalfContainer>

          <HalfContainer>
            <SideImage src='/static/img/business/hero.png' />
          </HalfContainer>
          <HalfContainer>
            <LeftAlign>
              <HeaderLol>How we help</HeaderLol>
              <li>do things</li>
              <li>do things</li>
              <li>do things</li>
              <li>do things</li>
            </LeftAlign>

            <HalfContainer />
          </HalfContainer>
        </FullPage2Grid>

        <FullPage>
          <TitleSectionSub
            title='How it works'
            subtitle='We provide ways to help your staff do awesome things in the community'
          />
        </FullPage>
        <FullBlock>
          <FullBlockMid>
            <HeaderMid>Voluntarily makes volunteering easier 😁</HeaderMid>
          </FullBlockMid>
        </FullBlock>
      </div>
    )
  }
}

export default publicPage(Test2)
