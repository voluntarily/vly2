import { Button, Icon, Tabs } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import MemberSection from '../Member/MemberSection'
import { FullPage, H3Bold, PageHeaderContainer, PBold } from '../VTheme/VTheme'
import OrgCategory from './OrgCategory'
const ButtonGroup = Button.Group

function callback (key) {
  // TODO: [VP-300] on tab change update the path so that the page is bookmark and reloadable
}
var shadowStyle = { overflow: 'visible', textAlign: 'center' }
const { TabPane } = Tabs

const TitleContainer = styled.div`
  margin: 1rem auto 3.5rem auto;
  width: 100%;
  text-align: center;
`

const SocialButton = styled(Button)`
  margin-top: 0.5rem;
  font-size: 2rem !important;
`

const ProfileContainer = styled.div`
  margin: 0 auto;
  position: relative;
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100% - 4rem);
    margin: initial;
  }

  @media screen and (max-width: 767px) {
    width: calc(100% - 2rem);
    margin: initial;
  }
`
const ProfileContentContainer = styled.div`
  width: 80rem;
  margin: 4rem auto;
  overflow: hidden;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100% - 4rem);
    margin: initial;
  }

  @media screen and (max-width: 767px) {
    width: calc(100% - 2rem);
    margin: initial;
  }
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
  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100% - 4rem);
    margin: initial;
  }

  @media screen and (max-width: 767px) {
    width: calc(100% - 2rem);
    margin: initial;
  }
`

const orgTab = (
  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    <Icon type='info-circle' />
    <FormattedMessage id='orgAbout' />
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
    <ProfileContainer>
      <ProfileImage src={org.imgUrl} alt={org.name} />
      <TitleContainer>
        <H3Bold>{org.name}</H3Bold>
      </TitleContainer>
    </ProfileContainer>
    <ProfileContentContainer>
      <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
        <TabPane tab={orgTab} key='1'>
          <AboutContainer>
            <Markdown children={(org.info && org.info.about) || ''} />
            <OrgCategory orgCategory={org.category} />
            <br />
            <PBold><FormattedMessage
              id='orgdetail.social.label'
              defaultMessage='Social:'
              description='Label for social media links on organisation details'
            />
            </PBold>
            <ButtonGroup size='medium'>
              {org.website && (
                <SocialButton
                  type='link'
                  href={`${org.website}`}
                  icon='global'
                  target='_blank'
                  rel='noopener noreferrer'
                />
              )}
              {org.contactEmail && (
                <SocialButton
                  type='link'
                  href={`mailto:${org.contactEmail}`}
                  icon='mail'
                  target='_blank'
                  rel='noopener noreferrer'
                />
              )}
              {org.facebook && (
                <SocialButton
                  type='link'
                  href={`https://www.facebook.com/${org.facebook}`}
                  icon='facebook'
                  target='_blank'
                  rel='noopener noreferrer'
                />
              )}
              {org.twitter && (
                <SocialButton
                  type='link'
                  href={`https://www.twitter.com/${org.twitter}`}
                  icon='twitter'
                  target='_blank'
                  rel='noopener noreferrer'
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
    </ProfileContentContainer>
  </FullPage>
)

OrgDetail.propTypes = {
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
