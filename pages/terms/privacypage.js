import securePage from '../../hocs/securePage'
import { FullPage, InfoSection } from '../../components/VTheme/VTheme'
import { Divider, Button } from 'antd'

const PrivacyPage = () => (
  <FullPage>
    <InfoSection>
      <h1>We care about privacy</h1>
      <Divider />
      <p>
      Your privacy is really important to us, as is the privacy of the people you’re supporting. Our Privacy Policy is as follows.
      </p>
      <br /><br />
      <strong>Basic Principles:</strong>
      <ul>
        <li>We will do our best to keep personal information safe and secure. We won't share it with anyone unless you ask us to.</li>
        <li>Other volunteers might share personal details with you. Respect their privacy and don't share their details unless they allow you to.</li>
        <li>Try to be kind, and to support those around you on the platform. We’ll try to do the same for you.
        </li>
      </ul>
      <aside>View the full<a> Privacy Policy</a></aside><br />
      <Button type='primary' shape='round' size='large' block>Accept Privacy Policy</Button>

    </InfoSection>
  </FullPage>
)

export default securePage(PrivacyPage)
