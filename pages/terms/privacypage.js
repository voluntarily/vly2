import securePage from '../../hocs/securePage'
import { FullPage, InfoSection, TermsButtonContainer, InfoItem } from '../../components/VTheme/VTheme'
import { Divider, Button } from 'antd'
// import Link from 'next/link'

const PrivacyPage = () => (
  <FullPage>
    <InfoSection>
      <h1>We care about privacy</h1>
      <Divider />
      <p>
      Your privacy is really important to us, as is the privacy of all the people who use the Website. Our Privacy Policy follows some basic principles:
      </p>

      <p />

      <InfoItem>
        <img src='../static/img/icons/shield.svg' />
        <p> We won’t share your personal information with anyone unless you allow us to.</p>
        <img src='../static/img/icons/chat.svg' />
        <p>Other Website users might share personal details with you.<br />Respect their privacy and don’t share their details unless they allow you to.</p>
        <img src='../static/img/icons/kind.svg' />
        <p>The platform is intended for use only by people who are at least 16 years old. We will do everything we can to keep you personal information safe.</p>
      </InfoItem>
      <aside>View the full<a href='/terms/privacy' target='_blank' rel='noreferrer noopener'> Privacy Policy</a></aside><br />
      {/* <Link>
        <a> */}
      <TermsButtonContainer>
        <div>
          <Button type='primary' shape='round' size='large' block>Accept Privacy Policy</Button>
        </div>
      </TermsButtonContainer>
      {/*   </a>
     </Link> */}
    </InfoSection>
  </FullPage>
)

export default securePage(PrivacyPage)
