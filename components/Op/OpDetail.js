/* Dumb React component Shows contents of an opportunity
 */
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import moment from 'moment'

import { Button } from 'antd'
import { FullPage } from '../../hocs/publicPage'
import { HalfGrid, Spacer } from '../VTheme/VTheme'
import OpDetailTagsDisplay from './OpDetailTagsDisplay'

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

export function OpDetail ({ op }) {
  // This will make sure that if the description is undefined we will set it to an empty string
  // Otherwise Markdown will throw error
  const description = op.description == null ? '' : op.description
  const startDate = op.date[0] ? moment(op.date[0]).format('ddd DD/MM/YY | HH:mm') : 'N/a'
  const endDate = op.date[1] ? moment(op.date[1]).format('DD-MM-YYYY') : 'Open ended opportunity'
  return (
    <FullPage>
      <Spacer />
      <Head>title = {op.title}</Head>
      <HalfGrid>
        <Left>
          <TitleFont>{op.title}</TitleFont>
          <ItemListing>Duration 🔥&nbsp;&nbsp;&nbsp;{op.duration}</ItemListing>
          <ItemListing>Location 🏫&nbsp;&nbsp;&nbsp;{op.location}</ItemListing>
          <ItemListing>Status 📝&nbsp;&nbsp;&nbsp;{op.status}</ItemListing>
          <ItemListing>Start date ⏱&nbsp;&nbsp;&nbsp; {startDate}</ItemListing>
          <ItemListing>End date 📣 &nbsp;&nbsp;{endDate} </ItemListing>
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
          <img style={{ width: '100%' }} src={op.imgUrl} alt={op.title} />
          <OpDetailTagsDisplay tags={op.tags} />
        </Right>
      </HalfGrid>
    </FullPage>
  )
}

OpDetail.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default OpDetail
