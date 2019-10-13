import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Navigation from '../Navigation/Navigation'
import { Grid, P, Spacer } from '../VTheme/VTheme'
import links from './FooterMenu'
import WomensRefuge from './WomensRefuge.js'

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

const FooterText = styled.div`
  letter-spacing: -0.4px;
  font-size: 1rem;
  margin-top: 1rem;
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    margin-left: 2rem;
  }

  @media screen and (max-width: 767px) {
    margin-left: 1rem;
    margin-right: 1rem;
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
  margin-bottom: 0.5rem;
`

const MenuItem = styled.a`
  font-weight: 700;
  font-size: 1.2rem;
  color: #333333;
  letter-spacing: -1.07px;
  line-height: 40px;
  @media screen and (max-width: 767px) {
    line-height: 64px;
    font-size: 2rem;
  }
`

const Footer = ({ isAuthenticated, ...props }) => (
  <FooterBackground>
    <script
      type='text/javascript'
      src='https://voluntarily.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/-t2deah/b/11/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=2e085869'
    />
    <script
      type='text/javascript'
      async
      src='https://www.googletagmanager.com/gtag/js?id=UA-141212194-1'
    />
    <script
      type='text/javascript'
      dangerouslySetInnerHTML={{
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-141212194-1'); `
      }}
    />
    <FooterContainer>
      <FooterLogo src='../../static/vlogo.svg' />
      <FooterText>
        <P>
          <FormattedMessage
            id='footer.credit'
            defaultMessage='Voluntarily is an awesome open source project run by the'
            description='line in the footer that says we are supported by PFCT.'
          />
          &nbsp;
          <a
            href='https://www.pamfergusson.org.nz/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Pam Fergusson Charitable Trust
          </a>
        </P>
        <P>
          <FormattedMessage
            id='version'
            defaultMessage='Version'
            description='Source coder version label.'
          />
          :&nbsp;
          <FormattedMessage
            id='revision'
            defaultMessage='local-build'
            description='Source code revision, auto generalted.'
          />
        </P>
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
          <MenuItem href='/business'>For Businesses</MenuItem>
          <br />
          <MenuItem href='/government'>For Governments</MenuItem>
          <br />
        </FooterGridItem>

        <FooterGridItem>
          <FooterGridItemTitle>Resources</FooterGridItemTitle>
          <MenuItem href='/about'>Getting started</MenuItem>
          <br />
          <MenuItem
            href='https://voluntarily.nz/blog'
            target='_blank'
            rel='noopener noreferrer'
          >
            Blog
          </MenuItem>
          <br />
          <MenuItem
            href='https://voluntarily.atlassian.net/servicedesk/customer/portals'
            target='_blank'
            rel='noopener noreferrer'
          >
            Help centre
          </MenuItem>
          <br />
          <MenuItem
            href='https://voluntarily.atlassian.net/servicedesk/customer/portal/2/group/3/create/12'
            target='_blank'
            rel='noopener noreferrer'
          >
            Contact Support
          </MenuItem>
          <br />
        </FooterGridItem>

        <FooterGridItem>
          <FooterGridItemTitle>Social</FooterGridItemTitle>
          <MenuItem
            href='http://twitter.com/voluntarilyhq'
            target='_blank'
            rel='noopener noreferrer'
          >
            Twitter
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.linkedin.com/groups/13709208/'
            target='_blank'
            rel='noopener noreferrer'
          >
            LinkedIn
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.youtube.com/channel/UCEDwH63ojQSq-S8us3iRZAA'
            target='_blank'
            rel='noopener noreferrer'
          >
            Youtube
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.facebook.com/voluntarilyAotearoa/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Facebook
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.messenger.com/t/voluntarilyAotearoa'
            target='_blank'
            rel='noopener noreferrer'
          >
            Messenger
          </MenuItem>
          <br />
          <MenuItem
            href='https://www.instagram.com/voluntarilyhq/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Instagram
          </MenuItem>
          <br />
        </FooterGridItem>

        <FooterGridItem>
          <FooterGridItemTitle>Project</FooterGridItemTitle>
          <MenuItem href='/about'>About us</MenuItem>
          <br />
          <MenuItem
            href='https://github.com/voluntarily/vly2'
            target='_blank'
            rel='noopener noreferrer'
          >
            Github Repo
          </MenuItem>
          <br />
          <MenuItem
            href='https://voluntarily.atlassian.net/wiki'
            target='_blank'
            rel='noopener noreferrer'
          >
            Developer resources
            Terms and Conditions()
          </MenuItem>
        </FooterGridItem>
      </Grid>
      <Spacer />
      <WomensRefuge />
    </FooterContainer>
          <MenuItem
            href='https://voluntarily.atlassian.net/wiki'
            target='_blank'
            rel='noopener noreferrer'
          >
          </MenuItem>
  

    {props.isAdmin && (
      <Navigation items={getAllowedLinks(isAuthenticated)} {...props} />
    )}
  </FooterBackground>
)

Footer.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = store => ({
  isAuthenticated: store.session.isAuthenticated,
  isAdmin: store.session.me.role && store.session.me.role.includes('admin')
})

export default connect(mapStateToProps)(Footer)
