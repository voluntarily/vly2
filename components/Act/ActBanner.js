import PropTypes from 'prop-types'
import React from 'react'
import { config } from '../../config/clientConfig'
import { Helmet } from 'react-helmet'
import { OpSectionGrid, BannerDetail } from '../VTheme/VTheme'
import {
  ItemContainer,
  ItemDuration,
  ItemImage,
  ItemNeeds
} from '../VTheme/ItemList'
import { OpStatusStamp, OpStatus } from '../Op/OpStatus'

export const ActBanner = ({ act, children }) => {
  // SEO Metadata
  const appUrl = `${config.appUrl}/acts/act._id`
  const owner = act.owner || ''
  const creator = `@${owner.name || ''}`
  return (
    <>
      <Helmet>
        <title>{act.name} - Voluntarily</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@voluntarilyHQ' />
        <meta name='twitter:creator' content={creator} />
        <meta property='og:url' content={appUrl} />
        <meta property='og:title' content={act.name} />
        <meta property='og:description' content={act.subtitle} />
        <meta property='og:image' content={act.imgUrl} />
      </Helmet>

      <OpSectionGrid>
        <div style={{ paddingTop: '3rem' }}>
          <h1>
            <OpStatus status={act.status} />
            {act.name}
          </h1>
          {/* {act.subtitle && <p>{act.subtitle}</p>} */}
          {/* <ul>
            <ItemIdLine item={act.offerOrg} path='orgs' />
          </ul> */}
          <ItemContainer>
            <li><ItemDuration duration={act.duration} /></li>
            <li><ItemNeeds volunteers={act.volunteers} /></li>
          </ItemContainer>
        </div>
        <BannerDetail>
          <OpStatusStamp status={act.status} />
          <ItemImage src={act.imgUrl} alt={act.name} />

        </BannerDetail>
      </OpSectionGrid>

    </>)
}

ActBanner.propTypes = {
  act: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    _id: PropTypes.string
  })
}

export default ActBanner
