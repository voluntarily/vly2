/* Dumb React component Shows contents of an opportunity
 */
import { Button, Divider } from 'antd'
import Markdown from 'markdown-to-jsx'
import moment from 'moment'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import sanitize from 'sanitize-html'
import styled from 'styled-components'
import TagDisplay from '../Tags/TagDisplay'
import IdLine from '../VTheme/IdLine'
import { FullPage, HalfGrid, Spacer } from '../VTheme/VTheme'

const Left = styled.div``

const Right = styled.div``

const TitleFont = styled.h1`
  font-weight: 900;
  font-size: 2rem;
  letter-spacing: -0.02rem;
`
const ItemListing = styled.p`
  font-weight: 500;
  font-size: 1rem;
  opacity: 1;
  color: initial;
  margin-bottom: 0.2rem;
`
const ItemP = styled.div`
  letter-spacing: -0.02rem;
  font-weight: 400;
  font-size: 1rem;
  opacity: 1;
  color: initial;
  margin-bottom: 1rem;
`
const TagContainer = styled.div`
  margin-top: 0.2rem;
`

export function OpDetail ({ op }) {
  // This will make sure that if the description is undefined we will set it to an empty string
  // Otherwise Markdown will throw error
  const description = op.description || ''
  const startDate = op.date[0]
    ? moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
    : 'Negotiable'
  const endDate = op.date[1]
    ? '  →  ' + '  →  ' + moment(op.date[1]).format('h:mmA · ddd DD/MM/YYYY')
    : ' '
  const img = op.imgUrl || '../../static/missingimage.svg'
  return (
    <FullPage>
      <Spacer />
      <Head><title>Voluntarily - {op.name}</title></Head>
      <HalfGrid>
        <Left>
          <TitleFont>{op.name}</TitleFont>
          <ItemListing>
            ⏱&nbsp;<strong>Duration:</strong>&nbsp;&nbsp;&nbsp;
            {sanitize(op.duration)}
          </ItemListing>
          <ItemListing>
            🗓&nbsp;<strong>Date:</strong>&nbsp;&nbsp;&nbsp; {startDate}{' '}
            {endDate}
          </ItemListing>
          <ItemListing>
            🏫&nbsp;<strong>Location:</strong>&nbsp;&nbsp;&nbsp;
            {sanitize(op.location)}
          </ItemListing>
          <ItemListing>
            📝&nbsp;<strong>Status:</strong>&nbsp;&nbsp;&nbsp;
            {sanitize(op.status)}
          </ItemListing>
          <Divider />
          {op.offerOrg && <ItemListing><IdLine item={op.offerOrg} path='orgs' /></ItemListing>}
          {op.requestor && <ItemListing><IdLine item={op.requestor} path='people' /></ItemListing>}
          <Divider />
          <Spacer />
          <ItemP>
            <Markdown
              children={description}
              options={{
                overrides: {
                  Button: { component: Button }
                }
              }}
            />
          </ItemP>
          <Spacer />
        </Left>
        <Right>
          <img style={{ width: '100%' }} src={img} alt={op.name} />
          <TagContainer>
            <TagDisplay tags={op.tags} />
          </TagContainer>
        </Right>
      </HalfGrid>
    </FullPage>
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
