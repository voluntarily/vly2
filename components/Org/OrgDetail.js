import React from 'react'
import { Button, Icon, Tabs } from 'antd'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Markdown from 'markdown-to-jsx'
import OrgCategory from './OrgCategory'
import Link from 'next/link'
import MemberSection from '../Member/MemberSection'
import Head from 'next/head'
import styled from 'styled-components'
import {
  PageHeaderContainer,
  GridContainer,
  TextPBold,
  TextH1,
  SpacerSmall
} from '../VTheme/VTheme'
const ButtonGroup = Button.Group

function callback (key) {
  // TODO: [VP-300] on tab change update the path so that the page is bookmark and reloadable
  // console.log(key)
}
var shadowStyle = { overflow: 'visible' }
const { TabPane } = Tabs

const TitleContainer = styled.div`
margin-bottom: 2rem;
`

const OrgGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 5rem;
`
const OrgContainer = styled.div`
  margin-top: 5rem;
`

const ContactContainer = styled.div`
  margin-top: 0.5rem;
`
const SocialButton = styled(Button)`
  margin-top: 0.5rem;
  font-size: 2rem !important;
`

const orgTab = (
  <span>
    <Icon type='info-circle' />
    <FormattedMessage
      id='orgAbout'
      defaultMessage='About'
      description='show opportunities list on volunteer home page'
    />
  </span>
)

const orgMemberTab = (
  <span>
    <Icon type='team' />
    <FormattedMessage
      id='orgMembers'
      defaultMessage='Members'
      description='show opportunities list on volunteer home page'
    />
  </span>
)

const OrgDetail = ({ org, ...props }) => (
  <div>
    <Head><title>Voluntarily - {org.name}</title></Head>
    <PageHeaderContainer />
    <OrgGrid>
      <GridContainer>
        <img
          style={{ width: '100%', maxWidth: '240px', objectFit: 'cover' }}
          src={org.imgUrl}
          alt={org.name}
        />
        <OrgCategory orgCategory={org.category} />

        <OrgContainer>
          <TextPBold>Get in touch</TextPBold>
          {org.website &&
            <ContactContainer>
              <Icon type='global' />&nbsp;&nbsp;
              <Link href={org.website}>
                {org.website}
              </Link>
            </ContactContainer>}
          {org.contactEmail && <ContactContainer><Icon type='mail' />&nbsp;&nbsp;{org.contactEmail}</ContactContainer>}
          <ButtonGroup size='large' >
            {org.facebook && <SocialButton type='link' href={`https://www.facebook.com/${org.facebook}`} target='_blank' icon='facebook' />}
            {org.twitter && <SocialButton type='link' href={`https://www.twitter.com/${org.twitter}`} target='_blank' icon='twitter' />}
          </ButtonGroup>
        </OrgContainer>
      </GridContainer>

      <GridContainer>
        <TitleContainer>
          <TextH1>{org.name}</TextH1>
        </TitleContainer>
        <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
          <TabPane tab={orgTab} key='1'>
            <SpacerSmall />
            <Markdown children={(org.info && org.info.about) || ''} />
          </TabPane>
          {/* <TabPane tab={orgResourcesTab} key='2' /> */}
          {/* <TabPane tab={orgInstructionTab} key='3' /> */}
          <TabPane tab={orgMemberTab} key='4'>
            <MemberSection org={org} />
          </TabPane>

        </Tabs>
      </GridContainer>
    </OrgGrid>
  </div>
)

OrgDetail.propTypes = {
  meid: PropTypes.string.isRequired,
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.shape({
      about: PropTypes.string.isRequired,
      followers: PropTypes.string,
      joiners: PropTypes.string,
      members: PropTypes.string,
      outsiders: PropTypes.string
    }),
    category: PropTypes.arrayOf(
      PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])
    ).isRequired,
    imgUrl: PropTypes.string,
    website: PropTypes.string,
    contactEmail: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default OrgDetail
