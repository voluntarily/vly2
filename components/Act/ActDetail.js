/* Dumb React component Shows contents of an activity
 */
import { Button } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import TagDisplay from '../Tags/TagDisplay'
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

export function ActDetail ({ act }) {
  const img = act.imgUrl || '../../static/missingimage.svg'
  return (
    <FullPage>
      <Spacer />
      <Head><title>{act.name}</title></Head>
      <HalfGrid>
        <Left>
          <TitleFont>{act.name}</TitleFont>
          <ItemListing>⏱&nbsp;{act.duration}</ItemListing>
          // TODO: [VP-204] add organisation and contact
          <ItemListing>📝&nbsp;{act.status}</ItemListing>
          <Spacer />
          <ItemP>
            <Markdown
              children={act.description}
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
          <img style={{ width: '100%' }} src={img} alt={act.name} />
          <TagContainer>
            <TagDisplay tags={act.tags} />
          </TagContainer>
        </Right>
      </HalfGrid>
    </FullPage>
  )
}

ActDetail.propTypes = {
  act: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    description: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default ActDetail
