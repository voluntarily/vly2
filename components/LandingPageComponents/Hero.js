import { Button } from 'antd'
// import Router from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'

// const Search = Input.Search

// this is the big container block that holds the container together lol
const AwesomeHeroContainer = styled.div`
  margin: 0 auto;
  height: auto;
  width: auto;
  

  @media screen and (min-width: 768px) {
    margin-top: 8rem;
    p {
    font-size: 1rem;
  }
  }

  @media screen and (min-width: 1200px) {
    width: 80rem;
  }

  p {
    font-size: 1.5rem;
  }

  @media screen and (max-width: 768px) {
   margin-top: 0;
  }


`

export const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;





  @media screen and (min-width: 1282px) and (max-width: 1921px) {
    grid-template-columns: 28rem 1fr;
    grid-column-gap: 3rem;
    height: 26rem;

 
  }

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: 22rem 1fr;
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
` // end HeroGrid

// start left hand video side
const HeroLeft = styled.div`





  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: 22rem;

    height: auto;
  }

  @media screen and (max-width: 768px) {
    position: relative;
    height: 20rem;
    width: 100vw;
    overflow: hidden;
  }
`

const AwesomeImage = styled.img`
  position: relative;
  text-align: center;
  margin: 0 auto;
  

  overflow: hidden;
  object-fit: cover;
  background-color: white;

  @media screen and (min-width: 1282px) and (max-width: 1921px) {
    width: 28rem;
    height: 28rem;
  }

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
   
    height: 22rem;

  }
  @media screen and (min-width: 769px) and (max-width: 1025px) {
    width: calc(100% - 2rem);

    margin-left: 2rem;

  }

  @media screen and (max-width: 768px) {
    height: 20rem;
    width: 100%;
    object-fit: cover;
    object-position: top;
  }
`
// end left hand video side

// start right hand copy + search + button side

const HeroRight = styled.div`
 
  display: grid;
  align-self: center;

  @media screen and (max-width: 768px) {
    margin: 1rem 1rem 0 1rem;
  }

`

const HeroText = styled.h1`
font-weight: 700;
font-size: 3.5rem;
letter-spacing: -1.2px;
line-height: 1.7;
@media screen and (min-width: 1282px) and (max-width: 1921px) {
 p {
   width: 60%;
 }
  }
@media screen and (min-width: 1026px) and (max-width: 1281px) {
  font-size:2.5rem;
  p {
   width: 60%;
  line-height: 1.5;
 }
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    font-size:2.5rem;
  }
  @media screen and (max-width: 768px) {
    font-size: 2.5rem;
    line-height: 1.5;
    margin-bottom: 1rem;

  }

  @media screen and (max-width: 560px) {
    font-size: 2rem;

    p {
      font-size: 1.2rem;
    }
  }
`

// const SearchBox = styled.div`
// width: 80%;
//   background-color: white;
//   height: 4rem;
//   margin: 1.5rem 0;
//   border-radius: 0.25rem;
//   padding: 8px;
//   box-shadow: 2px 2px 12px 0 rgba(0, 0, 0, 0.5);
//   @media screen and (min-width: 1026px) and (max-width: 1281px) {
//   width: initial;
//   }
//   @media screen and (min-width: 768px) and (max-width: 1025px) {
//     width: initial;
//   }
//   .ant-input-affix-wrapper .ant-input:not(:first-child) {
//     padding-left: 40px;
//   }
//   @media screen and (max-width: 768px) {
//    display: none;
//   }
// `

// end right hand copy and CTA side

// const handleSearch = search => {
//   Router.push({
//     pathname: '/search',
//     query: {
//       search
//     }
//   })
// }

// begin actual component
const Hero = ({ isAuthenticated }) => (
  <AwesomeHeroContainer>
    <HeroGrid>

      <HeroLeft>

        <AwesomeImage
          src='/static/img/hero2.png'
          alt={<FormattedMessage id='heroImgText' defaultMessage='Children Playing with Robots' description='Description for the hero image' />}
        />

      </HeroLeft>

      <HeroRight>
        <HeroText>People helping people.
          <p>
          We connect people who can volunteer time, advice, or stuff to those who need it.
          </p>
        </HeroText>
        {/* <SearchBox>
          <Search
            placeholder="Try 'remote learning'"
            prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />}
            enterButton='Search'
            size='large'
            // eslint-disable-next-line no-console
            onSearch={handleSearch}
            aria-label='Search for volunteering opportunties here'
          />
        </SearchBox> */}
        <div>
          {!isAuthenticated &&
            <> <Link href='/home'><Button type='primary' shape='round' size='large' style={{ marginTop: '1rem', marginRight: '0.5rem' }}> Sign up </Button></Link></>}
          <Button type='secondary' shape='round' size='large' href='https://blog.voluntarily.nz' style={{ marginTop: '1rem' }}>
            Learn more
          </Button>
        </div>
      </HeroRight>

    </HeroGrid>
  </AwesomeHeroContainer>
)
// LAUNCH IT. WOOOSH!
export default Hero
