import React from 'react'
import styled from 'styled-components'
import { Alert, Button, Row, Col } from 'antd';
import Link from 'next/link'

const HeroImage = styled.div`
  height: 60vh;
  width: 100%;
  background-image: url(/static/img/hero2.png); 
  background-position: center;
  background-size: cover
`

const HeroText = styled.div`
  padding: 4rem;
  h1 {
    font-size: 7vh;
    font-weight: 700;
    line-height: 8vh;
  }
  h2 {
    font-size: 4vh;
    font-weight: 200;
  }
`

const Hero = ({ isAuthenticated }) => (
  <>
    <div>
      <a href='https://covid19.govt.nz/' rel='noopener noreferrer' target='_blank' cursor="pointer">
        <Alert message="For official information and advice about COVID-19, please visit covid19.govt.nz" type="warning" showIcon banner closable />
      </a>
      <br/>
    </div>

    <Row align="middle">
      <Col xs={24} sm={24} md={9} lg={9} xl={9}>
       <HeroImage>&nbsp;</HeroImage>
      </Col>
      <Col xs={24} sm={24} md={14} lg={14} xl={14}></Col>
      <Col xs={24} sm={24} md={14} lg={14} xl={14}>
        <HeroText>
          <h1 className='title'>People helping people.</h1>
          <h2 className='subtitle'>We connect people who can volunteer time, advice, or stuff to those who need it.</h2>
          {!isAuthenticated &&
            <> 
            <Link href='/home'><Button type='primary' shape='round' size='large'> Sign up </Button></Link>&nbsp;&nbsp;
            </>
          }
          <Button type='secondary' shape='round' size='large' href='https://blog.voluntarily.nz' style={{ marginTop: '1rem' }}> Learn more </Button>
        </HeroText>
      </Col>
    </Row>
  </>
)

export default Hero
