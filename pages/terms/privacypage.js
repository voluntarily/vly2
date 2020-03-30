import securePage from '../../hocs/securePage'
import { FullPage, InfoSection, TermsButtonContainer, InfoItem } from '../../components/VTheme/VTheme'
import { Divider, Button } from 'antd'
import Link from 'next/link'

const PrivacyPage = () => (
  <FullPage>
    <InfoSection>
      <h1>We care about privacy</h1>
      <Divider />
      <p>
      Your privacy is really important to us, as is the privacy of the people you’re supporting. Our Privacy Policy is as follows.
      </p>
      <br /><br />

      <p>Basic Principles:</p>

      <InfoItem>
        <img src='../static/img/icons/shield.svg' />
        <p> We won't share your personal information with anyone unless you ask us to.</p>

        <img src='../static/img/icons/chat.svg' />
        <p>Other volunteers might share contact details with you. Respect their privacy and don't share their details unless they say its ok.</p>
        <img src='../static/img/icons/kind.svg' />
        <p>Please try to be kind, and to support those around you on the platform. We’ll try to do the same for you.</p>
      </InfoItem>
      <aside>View the full<a> Privacy Policy</a></aside><br />
      <Link href='/privacy'>
        <a>
          <TermsButtonContainer>
            <Button type='primary' shape='round' size='large' block>Accept Privacy Policy</Button>
          </TermsButtonContainer>
        </a>
      </Link>
    </InfoSection>
  </FullPage>
)

export default securePage(PrivacyPage)
