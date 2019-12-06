/* Dumb React component Shows contents of an activity
 */
import { FormattedMessage } from 'react-intl'
import { Button, Divider } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import TagDisplay from '../Tags/TagDisplay'
import { HalfGrid, OpSectionGrid } from '../VTheme/VTheme'
import {
  Left,
  Right,
  ItemContainer,
  ItemDescription,
  TagContainer,
  ItemDuration,
  ItemStatus,
  ItemIdLine,
  ItemVolunteers,
  ItemSpace,
  EquipmentList,
  ItemImage
} from '../VTheme/ItemList'
import { Role } from '../../server/services/authorize/role'

export function ActDetail ({ act, me }) {
  const img = act.imgUrl || '/static/missingimage.svg'
  const isOP = me && me.role.includes(Role.OPPORTUNITY_PROVIDER)
  return (
    <>
      <Head>
        <title>{act.name}</title>
      </Head>
      <HalfGrid>
        <Left>
          <ItemImage src={img} alt={act.name} />
        </Left>
        <Right>
          <h1>{act.name}</h1>
          <ItemIdLine item={act.offerOrg} path='orgs' />
          <ItemContainer>
            <ItemDuration duration={act.duration} />
            <ItemVolunteers volunteers={act.volunteers} />
            <ItemStatus status={act.status} />

          </ItemContainer>
          <Divider />
          {isOP && <Button size='large' shape='round' type='primary' href={`/op/new?act=${act._id}`}>Run Activity</Button>}
        </Right>
      </HalfGrid>

      <Divider />

      <OpSectionGrid>
        <div>
          <h2>About this Template</h2>
        </div>
        <ItemDescription>
          <Markdown
            children={act.description}
            options={{
              overrides: {
                Button: { component: Button }
              }
            }}
          />
          <TagContainer>
            <Divider />
            <h5>
              <FormattedMessage
                id='opTags'
                defaultMessage='Tags'
                description='Tags on an opportunity'
              />
            </h5>
            <TagDisplay tags={act.tags} />
          </TagContainer>
        </ItemDescription>
      </OpSectionGrid>

      <Divider />

      <OpSectionGrid>
        <div>
          <h2>What you will need</h2>
        </div>
        <ItemDescription>
          <ItemVolunteers volunteers={act.volunteers} />
          <ItemSpace space={act.space} />
          <EquipmentList equipment={act.equipment} />
        </ItemDescription>
      </OpSectionGrid>
      <Divider />

      <OpSectionGrid>
        <div>
          <h2>Written by</h2>
        </div>
        <ItemDescription>

          <ItemIdLine item={act.owner} path='people' />
          <ItemIdLine item={act.offerOrg} path='orgs' />
        </ItemDescription>
      </OpSectionGrid>

      <Divider />

      <TagContainer />
    </>
  )
}

ActDetail.propTypes = {
  act: PropTypes.shape({
    name: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    volunteers: PropTypes.number,
    space: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default ActDetail
