import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'antd'
import Markdown from 'markdown-to-jsx'
import OrgType from './OrgType'
import Head from 'next/head'
import styled from 'styled-components'
import {
  PageHeaderContainer,
  TextHeadingBlack,
  GridContainer,
  TextPBold,
  TextH1
} from '../VTheme/VTheme'
const OrgGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 5rem;
`
const OrgContainer=styled.div`
margin-top: 5rem;

`


const OrgDetail = ({ org, ...props }) => (
  <div>
    <Head title={org.title} />
    <PageHeaderContainer />
    <OrgGrid>
      <GridContainer>
        <img
          style={{ width: '100%', maxWidth: '240px' }}
          src={org.imgUrl}
          alt={org.name}
        />
        <OrgContainer>
          <TextPBold>Get in touch:</TextPBold>
        </OrgContainer>
      </GridContainer>

      <GridContainer>
<TextH1>{org.name}</TextH1>


        <OrgType orgType={org.type} />

        <Markdown children={org.about || ''} />
      </GridContainer>
    </OrgGrid>


  </div>
)

OrgDetail.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.arrayOf(
      PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])
    ).isRequired,
    imgUrl: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default OrgDetail
