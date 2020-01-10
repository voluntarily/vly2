/* Dumb React component Shows contents of an opportunity
 */
import PropTypes from 'prop-types'
import TagDisplay from '../Tags/TagDisplay'
import Html from '../VTheme/Html'
import { ItemIdLine, TagContainer } from '../VTheme/ItemList'
import { ProfilePanel, ProfileSection } from '../VTheme/Profile'

export function OpAboutPanel ({ op }) {
  const description = op.description || ''

  return (
    <ProfilePanel>
      <ProfileSection>
        <ItemIdLine item={op.requestor} path='people' />
        <TagContainer>
          <TagDisplay tags={op.tags} />
        </TagContainer>
      </ProfileSection>
      <ProfileSection>
        <Html>
          {description}
        </Html>
      </ProfileSection>

    </ProfilePanel>)
}

OpAboutPanel.propTypes = {
  op: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.string
    ).isRequired,
    description: PropTypes.string,
    requestor: PropTypes.string
  }).isRequired
}

export default OpAboutPanel
