/* Dumb React component Shows contents of an opportunity
 */
import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'

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
const TagContainer = styled.div`
  margin-top: 0.2rem;
`

export function OpDetail ({ op }) {
  // This will make sure that if the description is undefined we will set it to an empty string
  // Otherwise Markdown will throw error
  const description = op.description == null ? '' : op.description
  return (
    <FullPage>
      <Spacer />
      <Head>title = {op.title}</Head>
      <HalfGrid>
        <Left>
          <TitleFont>{op.title}</TitleFont>
          <ItemListing>⏱&nbsp;{op.duration}</ItemListing>
          <ItemListing>🏫&nbsp;{op.location}</ItemListing>
          <ItemListing>📝&nbsp;{op.status}</ItemListing>

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
          <TagContainer>
            <OpDetailTagsDisplay tags={op.tags} />
          </TagContainer>
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
