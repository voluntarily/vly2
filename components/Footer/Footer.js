import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { P, Spacer } from '../VTheme/VTheme'

const FooterBackground = styled.footer`
  background-color: #f3f3f3;
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

const FooterGrid = styled.article`
display: grid;
grid-template-columns: 2fr 1fr 1fr;
@media screen and (min-width: 1026px) and (max-width: 1281px) {
   
grid-template-columns: 2fr 1fr 1fr;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {

    grid-template-columns: 2fr 1fr 1fr;
  }

  @media screen and (max-width: 768px) {

    grid-template-columns: 1fr;
    grid-row-gap: 2rem;
  }
`

const FooterLogo = styled.img`

  width: 2.5rem;
`

const FooterText = styled.div`
  letter-spacing: -0.4px;
  font-size: 1rem;
  margin-top: 1rem;
  width: 24rem;
  @media screen and (max-width: 768px) {
 
word-break: break-all;
width: 100%;
}
`

const FooterGridItemTitle = styled.h3`
  font-weight: 500;
  font-size: 1.2rem;
  letter-spacing: -0.2px;
  margin-bottom: 0.5rem;
  color: black;
  list-style: none;
`

const MenuWrapper = styled.ul`
  margin-bottom: 2rem;
  padding: 0;

 
`

const MenuItem = styled.li`
list-style: none;


  a {
    font-weight: 700;
    font-size: 1rem;
    color: #333333;
    letter-spacing: -0.2px;
    line-height: 2;
 

    :hover {
      color: #6549AA;
    }

  }
`

const Revision = ({rev}) => {
  const url = 'https://github.com/voluntarily/vly2/commit/' + rev[0]?.split(/[ \- _ ]+/)[0]
  return (<a href={url} rel='noopener noreferrer' target='_blank'>{rev}</a>)
}

const Footer = () => (
  <FooterBackground>
    <FooterContainer>

      <Spacer />
      <FooterGrid>

        <div>
          <FooterLogo src='/static/vlogo.svg' alt='voluntarily logo' />
          <FooterText>
            <P>
              <FormattedMessage
                id='footer.credit'
                defaultMessage='Voluntarily is an open source volunteering platform, built by volunteers, to help volunteers volunteer voluntarily for volunteering projects.'
                description='line in the footer that says we are supported by PFCT.'
              />
              <br /><br />A part of the&nbsp;
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
                {txt => <Revision rev={txt} />}
              </FormattedMessage>
            </P>

          </FooterText>
        </div>

        <div>
          <FooterGridItemTitle>Project</FooterGridItemTitle>
          <MenuWrapper>

            <MenuItem><a href='https://blog.voluntarily.nz/get-involved' target='_blank' rel='noopener noreferrer'>Join the build</a></MenuItem>
            <MenuItem><a href='https://support.voluntarily.nz/hc/en-nz/requests/new?ticket_form_id=360003338774' target='_blank' rel='noreferrer noopener'>Suggest a Topic</a></MenuItem>
            <MenuItem>
              <a
                href='https://voluntarily.statuspage.io'
                target='_blank'
                rel='noopener noreferrer'
              >System Status
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='/terms'
                rel='noopener noreferrer'
              >Terms of Use
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='/terms/privacy'
                rel='noopener noreferrer'
              >Privacy Policy
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='/terms/conduct'
                rel='noopener noreferrer'
              >Code of Conduct
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href='https://github.com/voluntarily/vly2'
                target='_blank'
                rel='noopener noreferrer'
              >Github
              </a>
            </MenuItem>
          </MenuWrapper>
        </div>

        <div>
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
                href='https://www.instagram.com/voluntarilyhq/'
                target='_blank'
                rel='noopener noreferrer'
              >Instagram
              </a>
            </MenuItem>
          </MenuWrapper>
        </div>
      </FooterGrid>
      <Spacer />

    </FooterContainer>
  </FooterBackground>
)

export default Footer
