import securePage from '../../hocs/securePage'
import { FullPage, InfoSectionHeader } from '../../components/VTheme/VTheme'
import { Divider } from 'antd'

const PrivacyPage = () => (
  <FullPage>
    <InfoSectionHeader>
      <h2>We care about privacy</h2>
    </InfoSectionHeader>
    <Divider />
    <p>
        Your privacy is really important to us, as is the privacy of the people you’re supporting. Our Privacy Policy is as follows.
    </p>

  </FullPage>
)

export default securePage(PrivacyPage)
