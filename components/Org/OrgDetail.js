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
  PBold,
  H1,
  FullPage,
  H4
} from '../VTheme/VTheme'
const ButtonGroup = Button.Group

function callback (key) {
  // TODO: [VP-300] on tab change update the path so that the page is bookmark and reloadable
  // console.log(key)
}
var shadowStyle = { overflow: 'visible', textAlign: 'center' }
const { TabPane } = Tabs

const TitleContainer = styled.div`
  margin: 1rem auto 3.5rem auto;
  width: 100%;
  text-align: center;
`

const ContactContainer = styled.div`
  margin-top: 0.5rem;
`
const SocialButton = styled(Button)`
  margin-top: 0.5rem;
  font-size: 2rem !important;
`

const ButtonContainer = styled.div`
  margin-top: 1rem;
`

const ProfileHeaderContainer = styled.div`
  margin: 0 auto;
  position: relative;
`
const ProfileImage = styled.img`
  margin: 0 calc(50% - 100px);
  width: 200px;
  object-fit: cover;
`

const AboutContainer = styled.div`
  text-align: left;
  width: 50rem;
  margin: 4rem auto;
  overflow: hidden;

`

const orgTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='info-circle' />
    <FormattedMessage
      id='orgAbout'
    />
  </span>
)

const orgMemberTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='team' />
    <FormattedMessage
      id='orgMembers'
      defaultMessage='Members'
      description='show opportunities list on volunteer home page'
    />
  </span>
)

const orgInstructionTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='info-circle' />
    <FormattedMessage
      id='orgInstructions'
      defaultMessage='Getting Started'
      description='show opportunities list on volunteer home page'
    />
  </span>
)

const OrgDetail = ({ org, ...props }) => (
  <FullPage>
    <Head>
      <title>Voluntarily - {org.name}</title>
    </Head>
    <PageHeaderContainer />
    <ProfileHeaderContainer>
      <ProfileImage src={org.imgUrl} alt={org.name} />
      <TitleContainer>
        <H1>{org.name}</H1>
        <H4>Business • New Zealand</H4>
        <H4>
          {org.website && (
            <ContactContainer>
              <Link target='_blank' href={org.website}>
                <a target='_blank'>{org.website}</a>
              </Link>
            </ContactContainer>
          )}
        </H4>
        <ButtonContainer>
          <Button icon='notification' type='primary' shape='round' size='large'>
            Follow
          </Button>
        </ButtonContainer>
      </TitleContainer>
    </ProfileHeaderContainer>
    <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
      <TabPane tab={orgTab} key='1'>
        <AboutContainer>
          <Markdown children={(org.info && org.info.about) || ''} />
          <OrgCategory orgCategory={org.category} />
          <br />
          <PBold>Social:</PBold>
          <ButtonGroup size='medium'>
            {org.contactEmail && (
              <SocialButton
                type='link'
                href={`mailto:${org.contactEmail}`}
                target='_blank'
                icon='mail'
              />
            )}
            {org.facebook && (
              <SocialButton
                type='link'
                href={`https://www.facebook.com/${org.facebook}`}
                target='_blank'
                icon='facebook'
              />
            )}
            {org.twitter && (
              <SocialButton
                type='link'
                href={`https://www.twitter.com/${org.twitter}`}
                target='_blank'
                icon='twitter'
              />
            )}
          </ButtonGroup>
        </AboutContainer>
      </TabPane>
      {/* <TabPane tab={orgResourcesTab} key='2' /> */}
      <TabPane tab={orgInstructionTab} key='3' />
      <TabPane tab={orgMemberTab} key='4'>
        <MemberSection org={org} />
      </TabPane>
    </Tabs>

    <ProfileHeaderContainer />

    <GridContainer>
      <TitleContainer />
    </GridContainer>
  </FullPage>
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
