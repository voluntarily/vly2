
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LearnMoreButton, SignUpButton } from '../../components/VTheme/Buttons'
import { HeroItem, HeroText } from '../VTheme/VTheme'
// import { Button } from 'antd'
// const Search = Input.Search

// this is the big container block that holds the container together lol
const AwesomeHeroContainer = styled.div`
max-width: 80rem;
  margin: 2rem auto 0 auto;
  height: auto;
  width: auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 2.5rem;
  
  @media screen and (max-width: 1360px) {
   padding: 2.5rem;
  }
 
  @media screen and (max-width: 1024px) {
  padding: 0;
  grid-template-columns: 1fr;
  }
  @media screen and (max-width: 768px) {
    margin-top: 3rem;
  }
`

const CTAGrid = styled.section`
max-width: 80rem;
border-radius: 24px;
 box-shadow:  20px 20px 60px #d9d9d9, 
             -20px -20px 60px #ffffff; 
padding: 2.5rem 0 3.5rem 0 ;
margin: 6rem auto 4.5rem auto;
text-align: center;

a {
  color: #653cad;
}
h1 {
  font-size: 4rem;
  letter-spacing: -2px;
  
}

h3{
  margin-bottom: 1rem;
  font-weight: 400;
}

strong {
  font-weight: 700;
  color: #f35626;
background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
-webkit-animation: hue 10s infinite linear;
}

}

@-webkit-keyframes hue {
  from {
    -webkit-filter: hue-rotate(0deg);
  }
  to {
    -webkit-filter: hue-rotate(-360deg);
  }
}
@keyframes hue {
  from {
    -webkit-filter: hue-rotate(0deg);
  }
  to {
    -webkit-filter: hue-rotate(-360deg);
  }
}



@media screen and (max-width: 1440px) {
margin: 5rem 2rem 2.5rem 2rem;
padding: 3rem 0;
}

@media screen and (max-width: 1380px) {
  margin: 6rem 2rem 3rem 2rem;
  
}


@media screen and (max-width: 1024px) {
  h1 {
  font-size: 3rem;
  letter-spacing: -2.5px;
}

h3{
  margin-bottom: 1rem;
}
  margin: 8rem 3rem 5rem 3rem;
}
@media screen and (max-width: 768px) {

margin-bottom: 6rem;
 grid-template-columns: 1fr;
 
 h1 {
   font-size: 2.5rem;
line-height: 1.2;

letter-spacing: -1.5px;
   margin: 0;
 }
 h3 {
   margin-top: 1rem;
   font-size: 1.2rem;
 }
  }

  @media screen and (max-width: 568px) {
    margin: 5rem 1rem 0 1rem;
    padding: 2rem;
  h1 {
    font-size: 2rem;
    text-align: left;
    padding-right: 3rem;
  }
  h3 {
    width: 100%;
    text-align: left;
  }
  br {
    display: none;
  }
  button,a {
    width: 100%;
    margin-top: 1rem;
  }

  }

  @media screen and (max-width: 320px) {
    h3 {
      font-size: 1rem;
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
        <h1>Where <strong>Volunteering</strong> happens.</h1>
        <h3>Find volunteering opportunities and training.<br /> Make an impact in your community.</h3>
        {!isAuthenticated &&
          <SignUpButton then='/flow/postSignUp' />}  <LearnMoreButton />
      </div>

    </CTAGrid>
    <AwesomeHeroContainer>

      <a href='/a/ask'>
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
                defaultMessage='Ask for help from trained volunteers
                who have skills or time to spare'
              />
            </p>

          </HeroText>

          <img src='/static/img/landing-pages/ask-bg.png' />
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
      </a>
      <a href='/a/offer'>
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
                defaultMessage='Volunteer to receive training and help people in your community'
              />
            </p>

          </HeroText>
          <img src='/static/img/landing-pages/offer-bg.png' />
        </HeroItem>
      </a>

      <a href='https://blog.voluntarily.nz/contact-us'>
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
                defaultMessage='Empower your community group or
                organisation with Voluntarily'
              />
            </p>

          </HeroText>
          <img src='/static/img/landing-pages/partner-bg.png' />
        </HeroItem>
      </a>
    </AwesomeHeroContainer>

  </>
)
// LAUNCH IT. WOOOSH!
export default Hero
