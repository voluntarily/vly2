import PropTypes from 'prop-types'
import React from 'react'
import { config } from '../../config/config'
import { Helmet } from 'react-helmet'
import { HalfGrid } from '../VTheme/VTheme'
import {
  Left,
  Right,
  ItemContainer,
  ItemDuration,
  ItemStatus,
  ItemDate,
  ItemImage,
  ItemIdLine
} from '../VTheme/ItemList'
import moment from 'moment'
import { ShareLinks } from './OpShareLinks'
import { withRouter } from 'next/router'

const OpBanner = ({ op, children, router }) => {
  const startDate = op.date[0]
    ? moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
    : 'Negotiable'
  const endDate = op.date[1]
    ? '  →  ' + moment(op.date[1]).format('h:mmA · ddd DD/MM/YYYY')
    : ' '
  const img = op.imgUrl || '/static/missingimage.svg'

  // SEO Metadata
  const description = op.description || ''
  const requestor = op.requestor || ''
  const creator = `@${requestor.name || ''}`
  const appUrl = `${config.appUrl}${router.asPath}`

  return (
    <>
      <Helmet>
        <title>Voluntarily - {op.name}</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@voluntarilyHQ' />
        <meta name='twitter:creator' content={creator} />
        <meta property='og:url' content={appUrl} />
        <meta property='og:title' content={op.name} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={op.img} />
      </Helmet>
      <HalfGrid>
        <Left>
          <ItemImage src={img} alt={op.name} />
        </Left>
        <Right>
          <h1>{op.name}</h1>
          <ItemIdLine item={op.offerOrg} path='orgs' />
          <h4>
            {op.subtitle} <br />
            {op.location}
          </h4>
          <ItemContainer>
            <ItemDuration duration={op.duration} />
            <ItemDate startDate={startDate} endDate={endDate} />
            <ItemStatus status={op.status} />

            <ShareLinks url={appUrl} />

          </ItemContainer>
          <>
            {children}
          </>
        </Right>
      </HalfGrid>
    </>)
}

OpBanner.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  router: PropTypes.object.isRequired,
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default withRouter(OpBanner)
