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
  // width: 24rem;
  @media screen and (max-width: 768px) {

width: 100%;
}
`

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
                defaultMessage='Vocationally is a job matching platform designed to help individuals, businesses and organisations match up job vacancies with job hunters.
During national emergencies such as a pandemic there are large numberts of workers displaced as jobs are no longer required, but likewise many new jobs are created.
Vocationally assists with this problem by allowing job matching on an individual or group basis, keeping as many people employed as possible.'
              />
            </P>
          </FooterText>
        </div>

      </FooterGrid>
      <Spacer />

    </FooterContainer>
  </FooterBackground>
)

export default Footer
