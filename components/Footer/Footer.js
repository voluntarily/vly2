import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import Navigation from '../Navigation/Navigation'

import links from './FooterMenu'
import { Grid, Spacer } from '../VTheme/VTheme'
import styled from 'styled-components'
const getAllowedLinks = isAuthenticated =>
  links()
    .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
    .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly))

const FooterBackground = styled.div`
  margin-top: 5rem;
  width: 100vw;
  background-color: #fefefe;
`

const FooterContainer = styled.div`
  width: 80rem;
  margin: 0 auto;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: 100vw;
  }

  @media screen and (max-width: 767px) {
    width: 100vw;
  }
`

const FooterLogo = styled.img`
  margin-top: 2rem;
  width: 2.5rem;
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    margin-left: 2rem;
  }

  @media screen and (max-width: 767px) {
    margin-left: 1rem;
  }
`

const FooterText = styled.h1`
  letter-spacing: -0.4px;
  font-size: 1rem;
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    margin-left: 2rem;
  }

  @media screen and (max-width: 767px) {
    margin-left: 1rem;
  }
`

const FooterGridItem = styled.div`
  margin-bottom: 2rem;
  @media screen and (max-width: 767px) {
    margin-left: 1rem;
  }
`
const FooterGridItemTitle = styled.h1`
  font-weight: 400;
  font-size: 1rem;
  letter-spacing: -0.8px;
`

const MenuItem = styled.a`
  font-family: Inter;
  font-weight: 600;
  font-size: 1rem;
  color: #333333;
  letter-spacing: -1.07px;
  line-height: 32px;
  @media screen and (max-width: 767px) {
    line-height: 64px;
  }
`

const Footer = ({ isAuthenticated, ...props }) => (
  <FooterBackground>
    <FooterContainer>
      <FooterLogo src='../../static/vlogo.svg' />
      <FooterText>
        Voluntarily is an awesome open source project run by the&nbsp;
        <a href='https://www.pamfergusson.org.nz/' target='_blank'>
          Pam Fergussion Charitable Trust
        </a>{' '}
        lol
      </FooterText>
      <Spacer />
      <Grid>
        <FooterGridItem>
          <FooterGridItemTitle>How it works</FooterGridItemTitle>
          <MenuItem href='/volunteers'>For Volunteers</MenuItem>
          <br />
          <MenuItem href='/teachers'>For Teachers</MenuItem>
          <br />
          <MenuItem href='/charities'>For Charities</MenuItem>
          <br />
          <MenuItem href='/businesses'>For Businesses</MenuItem>
          <br />
          <MenuItem href='/government'>For Governments</MenuItem>
          <br />
        </FooterGridItem>

        <FooterGridItem>
          <FooterGridItemTitle>Resources</FooterGridItemTitle>
          <MenuItem>Getting started</MenuItem>
          <br />
          <MenuItem>Blog</MenuItem>
          <br />
          <MenuItem>Help centre</MenuItem>
          <br />
          <MenuItem>Contact Support</MenuItem>
          <br />
        </FooterGridItem>

        <FooterGridItem>
          <FooterGridItemTitle>Social</FooterGridItemTitle>
          <MenuItem href='http://twitter.com/voluntarilyhq' target='_blank'>
            Twitter
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.linkedin.com/groups/13709208/'
            target='_blank'
          >
            LinkedIn
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.youtube.com/channel/UCEDwH63ojQSq-S8us3iRZAA'
            target='_blank'
          >
            Youtube
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.facebook.com/voluntarilyAotearoa/'
            target='_blank'
          >
            Facebook
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.messenger.com/t/voluntarilyAotearoa'
            target='_blank'
          >
            Messenger
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.instagram.com/voluntarilyhq/'
            target='_blank'
          >
            Instagram
          </MenuItem>
          <br />
        </FooterGridItem>

        <FooterGridItem>
          <FooterGridItemTitle>Project</FooterGridItemTitle>
          <MenuItem href='/about'>About us</MenuItem>
          <br />
          <MenuItem href='https://github.com/voluntarily/vly2' target='_blank'>
            Github Repo
          </MenuItem>
          <br />
          <MenuItem>Jobs</MenuItem>
          <br />
          <MenuItem>Legal</MenuItem>
          <br />
        </FooterGridItem>
      </Grid>
      <Spacer />
    </FooterContainer>

    <Navigation items={getAllowedLinks(isAuthenticated)} {...props} />
  </FooterBackground>
)

Footer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}

export default Footer
