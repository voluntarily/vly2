/* Dumb React component Shows contents of an opportunity
 */
import { Button, Divider } from 'antd'
import Markdown from 'markdown-to-jsx'
import moment from 'moment'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import TagDisplay from '../Tags/TagDisplay'
import { HalfGrid, Spacer } from '../VTheme/VTheme'
import { Left, Right, ItemContainer, ItemDescription, TagContainer, ItemDuration, ItemStatus, ItemIdLine, ItemDate, ItemLocation } from '../VTheme/ItemList'

export function OpDetail ({ op }) {
  // This will make sure that if the description is undefined we will set it to an empty string
  // Otherwise Markdown will throw error
  const description = op.description || ''
  const startDate = op.date[0]
    ? moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
    : 'Negotiable'
  const endDate = op.date[1]
    ? '  →  ' + moment(op.date[1]).format('h:mmA · ddd DD/MM/YYYY')
    : ' '
  const img = op.imgUrl || '.././static/missingimage.svg'
  return (
    <>
      <Head>
        <title>Voluntarily - {op.name}</title>
      </Head>
      <HalfGrid>
        <Left>
          <h1>{op.name}</h1>
          <ItemContainer>
            <ItemDuration duration={op.duration} />
            <ItemDate startDate={startDate} endDate={endDate} />
            <ItemLocation location={op.location} />
            <ItemStatus status={op.status} />
            <Divider />
            <ItemIdLine item={op.offerOrg} path='orgs' />
            <ItemIdLine item={op.requestor} path='people' />
          </ItemContainer>
          <Divider />

          <ItemDescription>
            <Markdown
              style={{ width: '100%' }}
              children={description}
              options={{
                overrides: {
                  Button: { component: Button }
                }
              }}
            />
          </ItemDescription>
        </Left>
        <Right>
          <Spacer />
          <img style={{ width: '100%', zIndex: 2 }} src={img} alt={op.name} />
          <TagContainer>
            <TagDisplay tags={op.tags} />
          </TagContainer>
        </Right>
      </HalfGrid>
    </>
  )
}

OpDetail.propTypes = {
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string
  })
}

export default OpDetail
