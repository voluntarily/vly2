/* Dumb React component Shows contents of an opportunity
 */
import { Button, Divider } from 'antd'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { config } from '../../config/clientConfig'
import { ShareLinks } from '../Op/OpShareLinks'
import TagDisplay from '../Tags/TagDisplay'
import { HtmlMore } from '../VTheme/Html'
import { TagContainer } from '../VTheme/ItemList'
import { ProfilePanel } from '../VTheme/Profile'
import { OpSectionGrid } from '../VTheme/VTheme'
import { ActReadMore } from './ActReadMore'
import Link from 'next/link'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { ActOpsPanel } from './ActOpsPanel'
import { useSelector } from 'react-redux'
import { Role } from '../../server/services/authorize/role.js'

const { ASK, OFFER } = OpportunityType
export const ActAboutSection = ({ act }) =>
  <OpSectionGrid>
    <div id='left_column'>
      <h2><FormattedMessage id='ActAboutPanel.section.title.about' defaultMessage='About' /></h2>

    </div>
    <div id='right_column'>
      <HtmlMore>
        {act.description}
      </HtmlMore>
    </div>
  </OpSectionGrid>

export const ActActivityGuideSection = ({ act }) =>
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
        <Button shape='round' size='large'>
          <FormattedMessage
            id='ActAboutPanel.button.guide'
            defaultMessage='See all resources'
          />
        </Button>
      </Link>

    </div>
  </OpSectionGrid>

export function ActAboutPanel ({ act }) {
  const appUrl = `${config.appUrl}/acts/act._id`
  const me = useSelector(state => state.session.me)

  const isAnon = me.role.includes(Role.ANON)
  const vp = me.role.includes(Role.VOLUNTEER) || isAnon
  const bp = me.role.includes(Role.BASIC) || isAnon
  return (
    <ProfilePanel>
      <ActAboutSection act={act} />
      <Divider />
      {bp && <ActOpsPanel act={act} type={OFFER} limit={6} />}
      {vp && <ActOpsPanel act={act} type={ASK} limit={6} />}
      <Divider />
      <ActActivityGuideSection act={act} />
      <OpSectionGrid>
        <section>
          <h5><FormattedMessage id='ActAboutPanel.share' defaultMessage='Share' /></h5>
          <ShareLinks url={appUrl} />
        </section>
        <TagContainer>
          <TagDisplay tags={act.tags} />
        </TagContainer>
      </OpSectionGrid>
    </ProfilePanel>)
}

ActAboutPanel.propTypes = {
  act: PropTypes.shape({
    name: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.string
    ),
    description: PropTypes.string,
    requestor: PropTypes.object
  }).isRequired
}

export default ActAboutPanel
