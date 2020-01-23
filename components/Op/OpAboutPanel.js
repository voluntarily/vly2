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
export function OpAboutPanel ({ op }) {
  const description = op.description || ''
  const appUrl = `${config.appUrl}/ops/op._id`
  return (
    <ProfilePanel>
      
     
    <OpSectionGrid>
      <h2>About this activity</h2>
 <div>
        <Html>
          {description}
        </Html>
        <Divider />
        <TagContainer>
        <h5>Categories</h5>
          <TagDisplay tags={op.tags} />
        </TagContainer>

        <Divider />
        <h5>Share</h5>
        <ShareLinks url={appUrl} />
        </div>
        </OpSectionGrid>
        <Divider />
      <OpSectionGrid>
      <h2>About the organisers</h2>
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
