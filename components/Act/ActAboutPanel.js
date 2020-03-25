/* Dumb React component Shows contents of an opportunity
 */
import PropTypes from 'prop-types'
import TagDisplay from '../Tags/TagDisplay'
import Html from '../VTheme/Html'
import { TagContainer } from '../VTheme/ItemList'
import { ProfilePanel } from '../VTheme/Profile'
import { OpSectionGrid } from '../VTheme/VTheme'
import { Alert, Divider } from 'antd'
import { ShareLinks } from '../Op/OpShareLinks'
import { config } from '../../config/clientConfig'
import { FormattedMessage } from 'react-intl'
export function ActAboutPanel ({ act }) {
  const description = act.description || ''
  const appUrl = `${config.appUrl}/acts/act._id`
  const subtitle = act.subtitle ? <div><p>{act.subtitle}</p></div> : ''
  return (
    <ProfilePanel>
      <OpSectionGrid>
        <div>
          <h2><FormattedMessage id='ActAboutPanel.subtitle' defaultMessage='About this activity' /></h2>
          <Alert message={subtitle} type='info' showIcon />
        </div>
        <div>
          <Html>
            {description}
          </Html>
          <Divider />
          <TagContainer>
            <h5><FormattedMessage id='actCategories' defaultMessage='Categories' /></h5>
            <TagDisplay tags={act.tags} />
          </TagContainer>
          <Divider />
          <section>
            <h5><FormattedMessage id='actShare' defaultMessage='Share' /></h5>
            <ShareLinks url={appUrl} />
          </section>

        </div>
      </OpSectionGrid>

    </ProfilePanel>)
}

ActAboutPanel.propTypes = {
  act: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.string
    ),
    description: PropTypes.string,
    requestor: PropTypes.object
  }).isRequired
}

export default ActAboutPanel
