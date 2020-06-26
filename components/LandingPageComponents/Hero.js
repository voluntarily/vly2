
// import Router from 'next/router'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LearnMoreButton, SignUpButton } from '../../components/VTheme/Buttons'

// const Search = Input.Search

// this is the big container block that holds the container together lol
const AwesomeHeroContainer = styled.div`
  margin: 2rem auto 0 auto;
  height: auto;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  @media screen and (min-width: 1200px) {
   
  }
  p {
    font-size: 1.5rem;
  }
  @media screen and (max-width: 1280px) {
  }
  @media screen and (max-width: 600px) {
    margin-top: 3rem;
 grid-template-columns: 1fr;
  }
`

// start left hand video side
const HeroItem = styled.div`
    width: 100%;
    background-color: purple;
    height: 80vh;
    display: grid;
    grid-template-columns: 1fr;
    align-self: center;
    justify-self: center;
  
  @media screen and (max-width: 768px) {
height:50vh;
  }
  @media screen and (max-width: 600px) {
    position: relative;
    height: 20rem;
    width: 100vw;
    overflow: hidden;
  }
`

// end left hand video side

// start right hand copy + search + button side

const HeroRight = styled.div`
 
 background-color: black;
  display: grid;
  align-self: center;
  @media screen and (min-width: 768px) and (max-width: 1025px) { 
    margin-top: 2rem;
  }
  @media screen and (max-width: 768px) {
    margin: 1rem 1rem 0 1rem;
  }
`

const HeroText = styled.section`
    align-self: center;
    justify-self: center;
text-align: center;
    h1 {
font-weight: 700;
font-size: 3rem;
line-height: 1.5;
letter-spacing: -0.5px;
}
p {
  font-size: 1.25rem;
  margin-top: 0.5rem;
  font-weight: 400;
letter-spacing: 0;
}
@media screen and (min-width: 1922px) {
 p {
  

  
 }
}
@media screen and (min-width: 1282px) and (max-width: 1921px) {
 p {

  
 }
  }
@media screen and (min-width: 1026px) and (max-width: 1281px) {
  font-size:2.5rem;
  p {
  
  line-height: 1.5;
 }
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    h1 {
    font-size:2rem;
  }
    p {

  line-height: 1.5;
 }
  }
  @media screen and (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
    line-height: 1.5;
    margin-bottom: 1rem;
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

      <HeroItem>

        <HeroText>
          <h1>
            <FormattedMessage
              id='Hero.title.Volunteer'
              defaultMessage='Volunteer to help'
            />
          </h1>
          <p>
            <FormattedMessage
              id='Hero.body.Volunteer'
              defaultMessage='Volunteer to help people around your community'
            />
          </p>
        </HeroText>
      </HeroItem>

      <HeroItem>
        <HeroText>
          <h1>
            <FormattedMessage
              id='Hero.title.AskForHelp'
              defaultMessage='Ask for help'
            />
          </h1>
          <p>
            <FormattedMessage
              id='Hero.body.AskForHelp'
              defaultMessage='Get help from volunteers around your community'
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

      </HeroItem>

    </AwesomeHeroContainer>

    {!isAuthenticated &&
      <SignUpButton then='/flow/postSignUp' />}  <LearnMoreButton />
  </>
)
// LAUNCH IT. WOOOSH!
export default Hero
