import { Tabs, Divider } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import MemberSection from '../Member/MemberSection'
import RegisterMemberSection from '../Member/RegisterMemberSection'
import { PageHeaderContainer, ContactList, OrgTabs, FullPage } from '../VTheme/VTheme'
import OrgDetailForm from '../Org/OrgDetailForm'

function callback (key) {
  // TODO: [VP-300] on tab change update the path so that the page is bookmark and reloadable
}
const shadowStyle = { overflow: 'visible', textAlign: 'center' }
const { TabPane } = Tabs

const TitleContainer = styled.div`
  width: 100%;
  padding-left: 0;
  margin: 0 auto;
  text-align: center;

  @media screen and (min-width: 767px) {
    padding-left: 3rem;
    text-align: left;
  }
  
  a {
    display: block;
    padding: 1rem 0;
  }

  Button {
    background: #6549AA;
    color: white;
    width: 140px;
    height: 50px;
  }
`

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 100%;
  align-self: center;
  justify-self: center;

  @media screen and (min-width: 767px) {
    grid-template-columns: 25% 75%;
  }
`

const ProfileContentContainer = styled.div`
  width: 80rem;
  margin: 4rem auto 0;
  overflow: hidden;
  width: 100%;
`

const ProfileImage = styled.img`
  width: 200px;
  object-fit: cover;
  align-self: center;
  justify-self: center;
`

const TabContainer = styled.div`
  text-align: left;
  display: grid;
  grid-template-columns: 100%;
  margin-top: 3rem;
  margin-bottom: 3rem;
  width: 100%;

  @media screen and (min-width: 767px) {
    grid-template-columns: 20% 80%;
  }
`

const orgTab = (
  <OrgTabs>
    <FormattedMessage id='orgAbout' />
  </OrgTabs>
)

const orgMemberTab = (
  <OrgTabs>
    <FormattedMessage
      id='orgMembers'
      defaultMessage='Members'
      description='show opportunities list on volunteer home page'
    />
  </OrgTabs>
)

const orgInstructionTab = (
  <OrgTabs>
    <FormattedMessage
      id='orgInstructions'
      defaultMessage='Getting Started'
      description='show opportunities list on volunteer home page'
    />
  </OrgTabs>
)

const orgOffersTab = (
  <OrgTabs>
    <FormattedMessage
      id='orgOffers'
      defaultMessage='Offers'
      description='show opportunities list on volunteer home page'
    />
  </OrgTabs>
)

const orgSettingsTab = (
  <OrgTabs>
    <FormattedMessage
      id='orgSettings'
      defaultMessage='Settings'
      description='show opportunities list on volunteer home page'
    />
  </OrgTabs>
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
        <h1>{org.name}</h1>
        <Markdown children={(org.info && org.info.about) || ''} />
        <a href='{org.website}'>{org.website}</a>
        {props.isAuthenticated && (
          <RegisterMemberSection orgid={org._id} meid={props.me._id} />
        )}
      </TitleContainer>
    </ProfileContainer>
    <ProfileContentContainer>
      <Tabs style={shadowStyle} defaultActiveKey='1' onChange={callback}>
        <TabPane tab={orgTab} key='1'>
          <TabContainer>
            <h2>About</h2>
            <Markdown style={{ fontSize: '1.5rem' }} children={(org.info && org.info.about) || ''} />
          </TabContainer>
          <Divider />
          <TabContainer>
            <h2>Contact</h2>
            <ContactList>
              {org.website && (
                <li>Website<br /><a href={org.website} target='_blank' rel='noopener noreferrer'>{org.website}</a></li>
              )}
              {org.twitter && (
                <li>Twitter<br /><a href={org.twitter} target='_blank' rel='noopener noreferrer'>{org.twitter}</a></li>
              )}
              {org.facebook && (
                <li>Facebook<br /><a href={org.facebook} target='_blank' rel='noopener noreferrer'>{org.facebook}</a></li>
              )}
              {org.contactEmail && (
                <li>Email<br /><a href={`mailto:${org.contactEmail}`} target='_blank' rel='noopener noreferrer'>{org.contactEmail}</a></li>
              )}
              {org.address && (
                <li>Address<br /><a href={OrgDetailForm.createGoogleMapsAddressUrl(org.address)} target='_blank' rel='noopener noreferrer'>{org.address}</a></li>
              )}
              {org.contactPhoneNumber && (
                <li>Phone<br /><a tel={org.contactPhoneNumber}>{org.contactPhoneNumber}</a></li>
              )}
            </ContactList>
          </TabContainer>
        </TabPane>
        {/* <TabPane tab={orgResourcesTab} key='2' /> */}
        {/* // TODO: [VP-554] move the OpList for this org from the parent page to a tab  */}
        <TabPane tab={orgInstructionTab} key='3'>
          <TabContainer>
            <Markdown children={(org.info && org.info.instructions) || ''} />
          </TabContainer>
        </TabPane>
        <TabPane tab={orgMemberTab} key='4'>
          <MemberSection org={org} />
        </TabPane>
        <TabPane tab={orgOffersTab} key='5'>
          <MemberSection org={org} />
        </TabPane>
        <TabPane tab={orgSettingsTab} key='6'>
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
