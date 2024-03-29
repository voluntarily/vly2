/* Dumb React component Shows contents of an opportunity
 */
import TagDisplay from '../Tags/TagDisplay'
import Html from '../VTheme/Html'
import { ItemIdLine, TagContainer } from '../VTheme/ItemList'
import { ProfilePanel, ProfileSection } from '../VTheme/Profile'
import { OpSectionGrid, Spacer, H3 } from '../VTheme/VTheme'
import { Divider } from 'antd'
import { ShareLinks } from './OpShareLinks'
import { config } from '../../config/clientConfig'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { FormattedMessage } from 'react-intl'
export function OpAboutPanel ({ op }) {
  const description = op.description || ''
  const appUrl = `${config.appUrl}/ops/op._id`
  const subtitle = op.subtitle ? <div><p>{op.subtitle}</p><Divider /></div> : ''
  return (
    <ProfilePanel>

      <OpSectionGrid>
        <H3><FormattedMessage id='OpAboutPanel.section.title.about' defaultMessage='About' /></H3>
        <div>
          {op.fromActivity &&
            <>
              <Html>
                {op.fromActivity.description}
              </Html>
              <Divider />
            </>}
          {description &&
            <>
              <Html>{description}</Html>
              <Divider />
            </>}
          {subtitle}
          {op.address?.suburb},&nbsp;{op.address?.region}
          <TagContainer>
            <h5><FormattedMessage id='OpAboutPanel.categories' defaultMessage='Categories' /></h5>
            <TagDisplay tags={op.tags} />
          </TagContainer>
          <Divider />
          <section>
            <h5><FormattedMessage id='OpAboutPanel.share' defaultMessage='Share' /></h5>
            <ShareLinks url={appUrl} />
          </section>

        </div>
      </OpSectionGrid>
      <Divider />
      <OpSectionGrid>
        <h2><FormattedMessage id='actDetailForm.AboutSection.organisersubtitle' defaultMessage='About the organisers' /></h2>
        <ProfileSection>
          <ul>
            {(op.requestor.type === OpportunityType.OFFER) && <ItemIdLine item={op.requestor} path='people' />}
            <ItemIdLine item={op.offerOrg} path='orgs' />
          </ul>
        </ProfileSection>
      </OpSectionGrid>
      <Spacer />
    </ProfilePanel>
  )
}

export default OpAboutPanel
