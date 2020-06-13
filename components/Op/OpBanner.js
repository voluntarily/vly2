import PropTypes from 'prop-types'
import React from 'react'
import { config } from '../../config/clientConfig'
import { Helmet } from 'react-helmet'
import { SideBarGrid, BannerDetail, H2 } from '../VTheme/VTheme'
import {
  Left,
  ItemContainer,
  // ItemVenue,
  ItemDuration,
  LocationsList,
  ItemDate,
  ItemImage
} from '../VTheme/ItemList'
import moment from 'moment'
import { OpType } from './OpType'

const OpBanner = ({ op, children }) => {
  const startDate = op.date[0]
    ? moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
    : 'Negotiable'
  const endDate = op.date[1]
    ? '  →  ' + moment(op.date[1]).format('h:mmA · ddd DD/MM/YY')
    : ' '

  // SEO Metadata
  const appUrl = `${config.appUrl}/ops/op._id`
  const description = op.description || ''
  const requestor = op.requestor || ''
  const creator = `@${requestor.name || ''}`
  return (
    <>
      <Helmet>
        <title>{op.name} - Voluntarily</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@voluntarilyHQ' />
        <meta name='twitter:creator' content={creator} />
        <meta property='og:url' content={appUrl} />
        <meta property='og:title' content={op.name} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={op.imgUrl} />
      </Helmet>
      {/* // add space for the action bar */}
      <SideBarGrid>
        <Left>
          <ItemImage src={op.imgUrl} alt={op.name} />
        </Left>
        <BannerDetail>
          <small>{op.requestor.nickname} <OpType type={op.type} /> with</small>
          <h1>
            {op.name}
          </h1>
          {/* <ul>
             <ItemIdLine item={op.offerOrg} path='orgs' />
            <ItemIdLine item={op.fromActivity} path='acts' />
          </ul> */}
          <ItemContainer>
            <LocationsList locations={op.locations} />
            {/* {op.venue && <ItemVenue venue={op.venue} />} */}
            {op.duration && <ItemDuration duration={op.duration} />}
            <ItemDate startDate={startDate} endDate={endDate} />
          </ItemContainer>
          <>
            {children}
          </>
        </BannerDetail>
      </SideBarGrid>
    </>)
}

OpBanner.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    requestor: PropTypes.object,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    venue: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string
  })
}

export default OpBanner
