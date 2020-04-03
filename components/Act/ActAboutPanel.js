/* Dumb React component Shows contents of an opportunity
 */
import PropTypes from 'prop-types'
import TagDisplay from '../Tags/TagDisplay'
import Html from '../VTheme/Html'
import { TagContainer } from '../VTheme/ItemList'
import { ProfilePanel } from '../VTheme/Profile'
import { OpSectionGrid } from '../VTheme/VTheme'
import { Button, Divider } from 'antd'
import { ShareLinks } from '../Op/OpShareLinks'
import { config } from '../../config/clientConfig'
import { ActReadMore } from './ActReadMore'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
export function ActAboutPanel ({ act }) {
  const description = act.description || ''
  const appUrl = `${config.appUrl}/acts/act._id`
  return (
    <ProfilePanel>
      <OpSectionGrid>
        <div id='left_column'>
          <h2><FormattedMessage id='ActAboutPanel.section.title.about' defaultMessage='About' /></h2>
          <TagContainer>
            <TagDisplay tags={act.tags} />
          </TagContainer>
        </div>
        <div id='right_column'>
          <Html>
            {description}
          </Html>
        </div>
      </OpSectionGrid>
      <Divider />
      <OpSectionGrid>
        <div id='left_column'>
          <h2>
            <FormattedMessage
              id='ActAboutPanel.section.title.guide'
              defaultMessage='Activity Guide'
            />
          </h2>
        </div>
        <div id='right_column'>
          <p>
            <FormattedMessage
              id='ActAboutPanel.section.prompt.guide'
              defaultMessage='A description of what you need to prepare and do before you can do the thing.'
            />
          </p>
          <ActReadMore act={act} />
          <Link href={`/acts/${act._id}?tab=resources`}>
            <Button block shape='round' size='large'>
              <FormattedMessage
                id='ActAboutPanel.button.guide'
                defaultMessage='See all resources'
              />
            </Button>
          </Link>

        </div>
      </OpSectionGrid>
      <Divider />
      <OpSectionGrid>
        <section>
          <h5><FormattedMessage id='ActAboutPanel.share' defaultMessage='Share' /></h5>
          <ShareLinks url={appUrl} />
        </section>
      </OpSectionGrid>
      <Divider />

      <OpSectionGrid>
        <section>
          <h5><FormattedMessage id='ActAboutPanel.share' defaultMessage='Share' /></h5>
          <ShareLinks url={appUrl} />
        </section>
      </OpSectionGrid>
      <Divider />
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
