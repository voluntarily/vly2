
// import Router from 'next/router'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LearnMoreButton, SignUpButton } from '../../components/VTheme/Buttons'

// const Search = Input.Search

// this is the big container block that holds the container together lol
const AwesomeHeroContainer = styled.div`
  margin: 7rem auto 0 auto;
  height: auto;
  width: auto;
  

  @media screen and (min-width: 1200px) {
   
  }

  p {
    font-size: 1.5rem;
  }
  @media screen and (max-width: 1280px) {

  margin: 7rem auto 0rem auto;
  }

  @media screen and (max-width: 768px) {
   margin-top: 0;
   p {
    font-size: 1rem;
  }
  }


`

export const HeroGrid = styled.div`
  display: grid;
  margin: 0 auto;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;




  @media screen and (min-width: 1282px) and (max-width: 1921px) {

    height: 26rem;

 
  }

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: 22rem 1fr;
    grid-column-gap: 2rem;
    margin: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
    grid-column-gap: 0;
  }
` // end HeroGrid

// start left hand video side
const HeroLeft = styled.div`





  @media screen and (min-width: 769px) and (max-width: 1025px) {
    width: 22rem;

    height: auto;
  }

  @media screen and (max-width: 768px) {
height: 22rem;
width: 100vw;
  }

  @media screen and (max-width: 767px) {
    position: relative;
    height: 12rem;
    width: 100vw;
    overflow: hidden;
  }
`

const AwesomeImage = styled.img`
  position: relative;
  text-align: center;
  margin: 0 0 0 auto;
  width: 50%;
  display: grid;
 justify-self: end;
  overflow: hidden;
  object-fit: contain;
  background-color: white;

  @media screen and (min-width: 1282px) and (max-width: 1921px) {
    width: 100%;
    height: 28rem;

    object-position: right;
  }

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    width: 100%;
    height: 22rem;

  }
  @media screen and (min-width: 769px) and (max-width: 1025px) {
    width: calc(100% - 2rem);
    margin-left: 2rem;
  }
  @media screen and (max-width: 768px) {
height: 22rem;
width: 100%;
    object-fit: cover;
    object-position: center;
  }

  @media screen and (max-width: 767px) {
    height: 16rem;

    width: 100%;
    object-fit: cover;
    object-position: center;
  }
`
// end left hand video side

// start right hand copy + search + button side

const HeroRight = styled.div`
 
  display: grid;
  align-self: center;
  @media screen and (min-width: 768px) and (max-width: 1025px) { 
    margin-top: 2rem;
  }

  @media screen and (max-width: 768px) {
    margin: 1rem 1rem 0 1rem;
  }

`

const HeroText = styled.h1`
font-weight: 700;
font-size: 3rem;
line-height: 1.5;
letter-spacing: -0.5px;
margin-bottom: 0;
p {
  font-size: 1.25rem;
  margin-top: 0.5rem;
  font-weight: 400;
letter-spacing: 0;
}
@media screen and (min-width: 1922px) {
 p {
  
width: 40%;
  
 }
}

@media screen and (min-width: 1282px) and (max-width: 1921px) {
 p {
   width: 50%;
  
 }
  }
@media screen and (min-width: 1026px) and (max-width: 1281px) {
  font-size:2.5rem;
  p {
   width: 80%;
  line-height: 1.5;
 }
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    font-size:2rem;
    p {
   width: 90%;
  line-height: 1.5;
 }
  }
  @media screen and (max-width: 768px) {
  
    font-size: 1.5rem;
    line-height: 1.5;
    margin-bottom: 1rem;

  }

  @media screen and (max-width: 560px) {
    font-size: 1.5rem;

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
  <>
    <AwesomeHeroContainer>

      <HeroGrid>

        <HeroLeft>

          <AwesomeImage
            src='/static/img/hero3.png'
            alt={<FormattedMessage id='heroImgText' defaultMessage='Children Playing with Robots' description='Description for the hero image' />}
          />

        </HeroLeft>

        <HeroRight>
          <HeroText>
            <FormattedMessage
              id='Hero.title.PeopleHelpingPeople'
              defaultMessage='People helping people.'
            />
            <p>
              <FormattedMessage
                id='Hero.body.WeConnect'
                defaultMessage='We connect people who can volunteer time, advice, or stuff to those who need it.'
              />
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
              <SignUpButton then='/flow/postSignUp' />}
            <LearnMoreButton />
          </div>
        </HeroRight>

      </HeroGrid>
    </AwesomeHeroContainer>
  </>
)
// LAUNCH IT. WOOOSH!
export default Hero
