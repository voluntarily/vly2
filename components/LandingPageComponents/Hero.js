
// import Router from 'next/router'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LearnMoreButton, SignUpButton } from '../../components/VTheme/Buttons'
import { Button } from 'antd'
// const Search = Input.Search

// this is the big container block that holds the container together lol
const AwesomeHeroContainer = styled.div`
  margin: 2rem auto 0 auto;
  height: auto;
  width: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  
  @media screen and (min-width: 1200px) {
   
  }
  p {
    font-size: 1.5rem;
  }
  @media screen and (max-width: 1280px) {
  }
  @media screen and (max-width: 768px) {
    margin-top: 3rem;
 grid-template-columns: 1fr;
  }
`

// start left hand video side
const HeroItem = styled.div`
position: relative;
    width: 100%;
    background-color: black;
    height:40vh;
    min-height: 400px;
    overflow: hidden;
  
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;

    z-index: 0;
    object-fit: cover;
    object-position: center;
    }
  
  @media screen and (max-width: 768px) {
height:50vh;
  }
  @media screen and (max-width: 600px) {
    position: relative;
    height: 20rem;
    width: auto;
    overflow: hidden;

  }
`

// end left hand video side

const HeroText = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
    height: 100%;
    align-self: center;
    justify-content: center;
text-align: center;
z-index: 100;
button {
  z-index: 100;
  max-width: 15rem;
  margin: 0 auto;
}
    h1 {
font-weight: 700;
font-size: 2.5rem;
line-height: 1.5;
letter-spacing: -0.5px;
z-index: 100;

color: white;
}
p {
  font-size: 1.25rem;
  margin-top: 0.5rem;
  font-weight: 400;
letter-spacing: 0;
z-index: 100;
padding: 0 4rem;

color: white;
}

@media screen and (min-width: 1026px) and (max-width: 1281px) {
  h1 {
  font-size:2rem;
  }
  p {
  
padding: 0 2rem;
  line-height: 1.5;
 }
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    h1 {
    font-size:1.5rem;
  }
    p {
      font-size: 1rem;
  line-height: 1.5;

padding: 0 1rem;
 }
  }
  @media screen and (max-width: 768px) {
  h1 {
    font-size: 2rem;
    line-height: 1.5;
    margin-bottom: 0;
    
  }
  p {
    font-size: 1.5rem;
    margin: 1rem;
    padding: 0 1rem;
  }
  }
  
`

const CTAGrid = styled.section`
max-width: 80rem;
margin: 0 auto;
padding: 10rem 2rem 8rem 0rem;

a {
  color: #653cad;
}
h1 {
  font-size: 5rem;
  letter-spacing: -3px;
}

h3{
  margin-bottom: 1rem;
}


@media screen and (max-width: 1400px) {

padding-right:2rem;
}

@media screen and (max-width: 1281px) {
  h1 {
  font-size: 4rem;
  letter-spacing: -3px;
}
  padding: 6rem 2rem 2.5rem 2rem;
}
@media screen and (max-width: 768px) {
 padding: 5rem 1rem 2rem 1rem;
 grid-template-columns: 1fr;
 grid-row-gap: 1rem;
 h1 {
   font-size: 3.5rem;
   text-align: left;
   margin: 0;
 }
 h3 {
   margin-top: 0.5rem;
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
    <CTAGrid>
      <div>
        <h1>Help people.</h1>
        <h3>Find volunteering opportunities and training.<br />Make an impact in your community.</h3>
        {!isAuthenticated &&
          <SignUpButton then='/flow/postSignUp' />}  <LearnMoreButton />
      </div>

    </CTAGrid>
    <AwesomeHeroContainer>

      <HeroItem>

        <HeroText>
          <h1>
            <FormattedMessage
              id='Hero.title.Volunteer'
              defaultMessage='Want to help people?'
            />
          </h1>
          <p>
            <FormattedMessage
              id='Hero.body.Volunteer'
              defaultMessage='Volunteer to help people around your community'
            />
          </p>

          <a href='/a/offer'>
            <Button
              block
              type='primary'
              shape='round'
              size='large'
            > Browse activities
            </Button>
          </a>
        </HeroText>
        <img src='/static/img/landing-pages/volunteerbg.png' />
      </HeroItem>

      <HeroItem>
        <HeroText>
          <h1>
            <FormattedMessage
              id='Hero.title.AskForHelp'
              defaultMessage='Need support?'
            />
          </h1>
          <p>
            <FormattedMessage
              id='Hero.body.AskForHelp'
              defaultMessage='Browse Volunteers that want to help '
            />
          </p>
          <a href='/a/ask'>
            <Button
              block
              type='primary'
              shape='round'
              size='large'
            > Browse offers
            </Button>
          </a>
        </HeroText>

        <img src='/static/img/landing-pages/askbg.png' />
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

      <HeroItem>

        <HeroText>
          <h1>
            <FormattedMessage
              id='Hero.title.partner'
              defaultMessage='Partner with us'
            />
          </h1>
          <p>
            <FormattedMessage
              id='Hero.body.partner'
              defaultMessage='Empower your Organisation or Community Group with Volunteers from Voluntarily'
            />
          </p>

          <a href='/a/offer'>
            <Button
              block
              type='primary'
              shape='round'
              size='large'
            > Learn more
            </Button>
          </a>
        </HeroText>
        <img src='/static/img/landing-pages/partnerbg.png' />
      </HeroItem>

    </AwesomeHeroContainer>

  </>
)
// LAUNCH IT. WOOOSH!
export default Hero
