/* Dumb React component Shows contents of an opportunity
 */
import PropTypes from 'prop-types'
import TagDisplay from '../Tags/TagDisplay'
import Html from '../VTheme/Html'
import { ItemIdLine, TagContainer } from '../VTheme/ItemList'
import { ProfilePanel, ProfileSection } from '../VTheme/Profile'
import { OpSectionGrid, Spacer } from '../VTheme/VTheme'
import { Divider } from 'antd'
import { ShareLinks } from './OpShareLinks'
import { config } from '../../config/config'
import { FormattedMessage } from 'react-intl'
export function OpAboutPanel ({ op }) {
  const description = op.description || ''
  const appUrl = `${config.appUrl}/ops/op._id`
  const subtitle = op.subtitle ? <div><p>{op.subtitle}</p><Divider/></div> : '';
  return (
    <ProfilePanel>

      <OpSectionGrid>
        <h2><FormattedMessage id='actDetailForm.AboutSection.subtitle' defaultMessage='About this activity' /></h2>
        <div>
          {subtitle}
 
          <Html>
            {description}
          </Html>
          <Divider />
          <TagContainer>
            <h5><FormattedMessage id='actCategories' defaultMessage='Categories' /></h5>
            <TagDisplay tags={op.tags} />
          </TagContainer>

          <Divider />
          <h5><FormattedMessage id='actShare' defaultMessage='Share' /></h5>
          <ShareLinks url={appUrl} />
        </div>
      </OpSectionGrid>
      <Divider />
      <OpSectionGrid>
        <h2><FormattedMessage id='actDetailForm.AboutSection.organisersubtitle' defaultMessage='About the organisers' /></h2>
        <ProfileSection>
          <ItemIdLine item={op.requestor} path='people' />

        </ProfileSection>
      </OpSectionGrid>
      <Spacer />
    </ProfilePanel>)
}

OpAboutPanel.propTypes = {
  op: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.string
    ),
    description: PropTypes.string,
    requestor: PropTypes.object
  }).isRequired
}

export default OpAboutPanel
