
import React from 'react'
import styled from 'styled-components'
import { HalfGrid, H2, H3 } from '../VTheme/VTheme'
import { Button } from 'antd'
const PersonaBox = styled.section`
@media screen and (max-width: 1300px) {
  margin: 0 1rem;
}
 
`

const PersonaHeader = styled.div`
margin: 6rem 0 0 0;
text-align: left;
max-width: 60rem;
h2 {
  font-weight: 700;
  
}


@media screen and (max-width: 768px) {
  margin-top: 2rem;
}
`

const PersonaContainer = styled.div`
padding: 2rem;
border-radius: 16px;

box-shadow: 4px 4px 24px rgba(0, 0, 0, 0.25);
text-align: left;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 2rem;
    font-weight: 700;
  }
 article {
   display: grid;
   grid-column-gap: 1rem;
   grid-row-gap: 2rem;
    grid-template-columns: 3.5rem 1fr;

    img {
      align-self: center;
    }

 }
 div{ 
   width: 80%;
   min-height: 3rem;
 }
 button {
   margin-top: 2rem;
 }



 /* Mobile */
 @media screen and (max-width: 768px) {
padding: 1.5rem;
margin-right: 2rem;
div {
  width: 100%;
}
}
@media screen and (max-width: 560px) {

margin-right: 0;
  article {
grid-template-columns:1fr;
}
}
`

const Title = styled.h4`
  height: auto;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.1px;
  color: black;
  margin: 0;

  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const Text = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  color: black;
  letter-spacing: -0.1px;
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

const HowSection = () => (
  <PersonaBox>
    <PersonaHeader>
      <H2>How it works</H2>
      <H3>We add smarts to your volunteering. Voluntarily is an open-source matchmaking platform to connect volunteers who can help with people asking for help.</H3>
    </PersonaHeader>
    <HalfGrid>

      <PersonaContainer>

        <h3>Want to volunteer?</h3>
        <article>
          <img src='./static/img/icons/offer2.svg' alt='' />
          <div>
            <Title>List how you want to help
            </Title>
            <Text>Let people know how you can help out in your community</Text>
          </div>

          <img src='./static/img/icons/offer3.svg' alt='' />
          <div>
            <Title>Voluntarily finds you people who want help</Title>
            <Text>Our matchmaking system finds you people who are looking for your skills and time</Text>
          </div>
        </article>
        <a href='/a/ask'>
          <Button size='large' shape='round' type='primary' block>See activities</Button>
        </a>
      </PersonaContainer>
      <PersonaContainer>
        <h3>Want help with something?</h3>
        <article>
          <img src='./static/img/icons/ask3.svg' alt='' />
          <div>
            <Title>List what you need help with
            </Title>
            <Text>Let volunteers what you need help with, when you need help, and volunteers will get involved</Text>
          </div>

          <img src='./static/img/icons/ask2.svg' alt='' />
          <div>
            <Title>Voluntarily finds you volunteers that are keen</Title>
            <Text>Our matchmaking system finds skilled volunteers who want to help you</Text>
          </div>
        </article>
        <a href='/a/offer'>
          <Button size='large' shape='round' type='primary' block>See all offers</Button>
        </a>
      </PersonaContainer>

    </HalfGrid>

  </PersonaBox>
)
export default HowSection
