import { Button } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { HalfGrid } from '../VTheme/VTheme'

const AboutLeft = styled.div`
  margin-top: 10%;

  h1 {
    font-weight: 900;
    font-size: 1.8rem;
    letter-spacing: -1px;
    line-height: 2.5rem;
  }

  p {
    line-height: 1.8;
    font-size: 1.2rem;
    letter-spacing: -0.6px;
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    margin-top: 1rem;
    margin-right: 2rem;
  }

  @media screen and (max-width: 768px) {
    margin-top: initial;
    margin-left: 1rem;
    margin-bottom: 3rem;
    
    h1 {
      font-size: 2rem;
      line-height: 1.3;
    }

    p {
      color: #333;
      line-height: 2;
      font-size: 1rem;
      width: 90vw;
    }
  }
`

const AboutRight = styled.img`
  width: 39rem;
  justify-self: end;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    width: 24rem;
    justify-self: start;
    margin-left: 2rem;
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media screen and (max-width: 768px) {
    width: calc(100vw - 2rem);
    justify-self: start;
    margin: initial;
  }
`

const AboutSection = ({ title, subtitle, ...props }) => (
  <HalfGrid>
    <AboutLeft>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <Button type='primary' shape='round' size='large' href='/about'>
        <FormattedMessage
          id='SignUp'
          defaultMessage='Sign up'
          description='Action button to learn more about Voluntari.ly'
        />
      </Button>
    </AboutLeft>
    <AboutRight src='/static/img/schoolsactivity.png' />
  </HalfGrid>
)
export default AboutSection
