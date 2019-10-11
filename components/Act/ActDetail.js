/* Dumb React component Shows contents of an activity
 */
import { Button, Divider } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import TagDisplay from '../Tags/TagDisplay'
import { HalfGrid, Spacer } from '../VTheme/VTheme'
import { Left, Right, ItemContainer, ItemDescription, TagContainer, ItemVolunteers, ItemDuration, ItemStatus, ItemIdLine } from '../VTheme/ItemList'

export function ActDetail ({ act }) {
  const img = act.imgUrl || '../../static/missingimage.svg'
  return (
    <>
      <Head><title>{act.name}</title></Head>
      <HalfGrid>
        <Left>

          <h1>{act.name}</h1>
          <ItemContainer>
            <ItemDuration duration={act.duration} />
            <ItemStatus status={act.status} />
            <ItemVolunteers volunteers={act.volunteers} />
            <Divider />
            <ItemIdLine item={act.offerOrg} path='orgs' />
            <ItemIdLine item={act.owner} path='people' />
          </ItemContainer>
          <Divider />
          <ItemDescription>
            <Markdown
              children={act.description}
              options={{
                overrides: {
                  Button: { component: Button }
                }
              }}
            />
          </ItemDescription>
          <Spacer />
        </Left>
        <Right>
          <Spacer />
          <img style={{ width: '100%' }} src={img} alt={act.name} />
          <TagContainer>
            <TagDisplay tags={act.tags} />
          </TagContainer>
        </Right>
      </HalfGrid>
    </>
  )
}

ActDetail.propTypes = {
  act: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    volunteers: PropTypes.number,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default ActDetail
