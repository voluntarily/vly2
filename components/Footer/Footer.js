import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Navigation from '../Navigation/Navigation'
import { P, Spacer } from '../VTheme/VTheme'
import links from './FooterMenu'
import { Row, Col } from 'antd'
// import WomensRefuge from './WomensRefuge.js'

const getAllowedLinks = isAuthenticated =>
  links()
    .filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
    .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly))

const FooterBackground = styled.footer`
  background-color: #fefefe;
`

const FooterContainer = styled.div`
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;

  @media screen and (min-width: 1300px) {
    width: 80rem;
    margin: auto;
    padding: 0;
  }
`
const FooterLogo = styled.img`
  margin-top: 2rem;
  width: 2.5rem;
`

const FooterText = styled.div`
  letter-spacing: -0.4px;
  font-size: 1rem;
  margin-top: 1rem;
`

const FooterGridItemTitle = styled.h3`
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.8px;
  margin-bottom: 0.5rem;
  color: black;
  list-style: none;
`

const MenuWrapper = styled.ul`
  margin-bottom: 2rem;
  padding: 0;

  @media screen and (min-width: 576px) {
    height: 300px;
  }
`

const MenuItem = styled.li`
list-style: none;


  a {
    font-weight: 700;
    font-size: 1.2rem;
    color: #333333;
    letter-spacing: -1.07px;
    line-height: 40px;

:hover {
  color: #6549AA;
}

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
      <FooterLogo src='/static/vlogo.svg' alt='voluntarily logo' />
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
            id='revision' // set in server.js
            defaultMessage='local-build'
            description='Source code revision, auto generated.'
          >
            {txt => <a href={'https://github.com/voluntarily/vly2/commit/' + txt.split(/[ \- _ ]+/)[0]} rel='noopener noreferrer' target='_blank'>{txt}</a>}
          </FormattedMessage>
        </P>
      </FooterText>
      <Spacer />
      <Row>
        {/* <Col sm={12} lg={6}>
          <FooterGridItemTitle>How it works</FooterGridItemTitle>
          <MenuWrapper>

            <MenuItem><a href='/volunteers'>For Volunteers</a></MenuItem>
            <MenuItem><a href='/teachers'>For Teachers</a></MenuItem>
            <MenuItem><a href='/charities'>For Charities</a></MenuItem>
            <MenuItem><a href='/business'>For Businesses</a></MenuItem>
            <MenuItem><a href='/government'>For Governments</a></MenuItem>
          </MenuWrapper>
        </Col> */}

        <Col sm={12} lg={6}>
          <FooterGridItemTitle>Resources</FooterGridItemTitle>
          <MenuWrapper>

            <MenuItem><a href='https://voluntarily.atlassian.net/servicedesk/customer/portal/2/group/3/create/17' target='_blank' rel='noreferrer noopener'>Suggest a Topic</a></MenuItem>
            <MenuItem>
              <a
                href='https://blog.voluntarily.nz/'
                target='_blank'
                rel='noopener noreferrer'
              >Blog
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://voluntarily.atlassian.net/servicedesk/customer/portals'
                target='_blank'
                rel='noopener noreferrer'
              >Help centre
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://voluntarily.atlassian.net/servicedesk/customer/portal/2/group/3/create/12'
                target='_blank'
                rel='noopener noreferrer'
              >Contact Support
              </a>
            </MenuItem>
          </MenuWrapper>
        </Col>

        <Col sm={12} lg={6}>
          <FooterGridItemTitle>Social</FooterGridItemTitle>
          <MenuWrapper>

            <MenuItem>
              <a
                href='http://twitter.com/voluntarilyhq'
                target='_blank'
                rel='noopener noreferrer'
              >Twitter
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://www.linkedin.com/groups/13709208/'
                target='_blank'
                rel='noopener noreferrer'
              >LinkedIn
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://www.youtube.com/channel/UCEDwH63ojQSq-S8us3iRZAA'
                target='_blank'
                rel='noopener noreferrer'
              >Youtube
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://www.facebook.com/voluntarilyhq/'
                target='_blank'
                rel='noopener noreferrer'
              >Facebook
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://www.messenger.com/t/voluntarilyhq'
                target='_blank'
                rel='noopener noreferrer'
              >Messenger
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://www.instagram.com/voluntarilyhq/'
                target='_blank'
                rel='noopener noreferrer'
              >Instagram
              </a>
            </MenuItem>
          </MenuWrapper>
        </Col>

        <Col sm={12} lg={6}>
          <FooterGridItemTitle>Project</FooterGridItemTitle>
          <MenuWrapper>

            <MenuItem><a href='/about'>About us</a></MenuItem>
            <MenuItem>
              <a
                href='https://voluntarily.statuspage.io'
                target='_blank'
                rel='noopener noreferrer'
              >Status
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://github.com/voluntarily/vly2'
                target='_blank'
                rel='noopener noreferrer'
              >Github Repo
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://voluntarily.atlassian.net/wiki'
                target='_blank'
                rel='noopener noreferrer'
              >Developer resources
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='/terms'
                target='_blank'
                rel='noopener noreferrer'
              >Terms and Conditions
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='/terms/privacy'
                target='_blank'
                rel='noopener noreferrer'
              >Privacy
              </a>
            </MenuItem>
          </MenuWrapper>
        </Col>
      </Row>
      <Spacer />
      {/* <WomensRefuge /> */}
    </FooterContainer>
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
