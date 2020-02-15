import { defaultToHttpScheme } from '../../lib/urlUtil'
import { Divider, Icon } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import MemberUl from '../Member/MemberUl'
import TagDisplay from '../Tags/TagDisplay'
import { GridContainer, H1, H3Bold, H4 } from '../VTheme/VTheme'
import PersonRoles from './PersonRole'
import PersonPronouns from './PersonPronoun'
import { PersonBadgeSection } from './PersonBadge'

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 5rem;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: 16rem 1fr;
    gap: 5rem;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: calc(100vw - 2rem);
  }

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    grid-template-columns: calc(100vw - 2rem);
  }
`

const ProfileImage = styled.img`
  max-width: 100%;
  min-height: 256px;
  display: block;
  margin: 0 auto;
`

const DetailItem = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  @media screen and (max-width: 767px) {
    display: none;
  }
`
const DetailItemMobile = styled.div`
  display: none;

  @media screen and (max-width: 767px) {
    display: initial;
    margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  position: relative;
  }
`

const StyledIcon = styled(Icon)`
  margin-right: 0.5rem;
`

const InfoSection = styled.div`
  background-color: none;
  min-height: 5rem;
  margin-bottom: 2rem;
`
const PersonUl = styled.ul`
  list-style: none;
  padding:0;
  margin:0;
  @media screen and (min-width: 767px) {
    columns: 2;
    -webkit-columns: 2;
    -moz-columns: 2;
  }
`

const PersonDetail = ({ person }, ...props) => (
  <ProfileGrid>
    <GridContainer> {/* Left Sidebar */}
      <Head title={person.nickname} />
      <ProfileImage src={person.imgUrl} alt={person.nickname} />
      {person.orgMembership &&
        <DetailItem>
          <H4>
            <FormattedMessage
              id='PersonDetail.subheading.membership'
              defaultMessage='Member of'
              description='Header for list of orgs I belong to'
            />
          </H4>
          <MemberUl members={person.orgMembership} />
        </DetailItem>}
      {person.orgFollowership &&
        <DetailItem>
          <H4>
            <FormattedMessage
              id='PersonDetail.subheading.following'
              defaultMessage='Following'
              description='Header for list of orgs I follow'
            />
          </H4>
          <MemberUl members={person.orgFollowership} />
        </DetailItem>}
      <DetailItem>
        <H4>
          <FormattedMessage
            id='PersonDetail.subheading.achievements'
            defaultMessage='Recognition'
            description='Header for list of badges I have obtained'
          />
        </H4>
        <PersonBadgeSection person={person} />
      </DetailItem>
    </GridContainer>
    <GridContainer> {/* Main Workspace */}
      <InfoSection>
        <H1>{person.name}</H1>
        <Divider />
        <Markdown children={person.about || ''} />
      </InfoSection>
      <InfoSection>
        <PersonUl>
          <li>
            <a href={`mailto:${person.email}`}>
              <StyledIcon type='mail' />
              {person.email}
            </a>
          </li>
          <li>
            <a href={`tel:${person.phone}`}>
              <StyledIcon type='phone' />
              {person.phone}
            </a>
          </li>
          <li>
            <a href={defaultToHttpScheme(person.website)} rel='noopener noreferrer' target='_blank'>
              <StyledIcon type='global' />
              {person.website}
            </a>
          </li>
          <li>
            <a href={`https://www.facebook.com/${person.facebook}`} rel='noopener noreferrer' target='_blank'>
              <StyledIcon type='facebook' />
              {person.facebook}
            </a>
          </li>
          <li>
            <a href={`https://www.twitter.com/${person.twitter}`} rel='noopener noreferrer' target='_blank'>
              <StyledIcon type='twitter' />
              {person.twitter}
            </a>
          </li>
          <li>
            <StyledIcon type='compass' />
            {person.location}
          </li>
          <li>
            <StyledIcon type='idcard' />
            <PersonPronouns pronoun={person.pronoun} />
          </li>
          <li>
            <StyledIcon type='coffee' />
            <PersonRoles roles={person.role} />
          </li>
          <li>
            <StyledIcon type='book' />
            {person.education}
          </li>
          <li>
            <StyledIcon type='coffee' />
            {person.job}
          </li>
        </PersonUl>
      </InfoSection>
      <InfoSection>
        <H3Bold>
          <FormattedMessage
            defaultMessage='Interests and Skills'
            id='person.skills.title'
            description='subheading for tags on person details page'
          />
        </H3Bold>
        <TagDisplay tags={person.tags} />
      </InfoSection>
      <DetailItemMobile>
        <p><Icon type='history' /> </p>
      </DetailItemMobile>
      <DetailItemMobile>
        <p><Icon type='safety' /> </p>
      </DetailItemMobile>
      <InfoSection>
        <H3Bold>
          <FormattedMessage
            defaultMessage='Latest Activities'
            id='PersonDetail.title.CurrentActivities'
            description='subheading for activity list on person details page'
          />
        </H3Bold>
        <Divider />
      </InfoSection>
    </GridContainer>
  </ProfileGrid>

)

PersonDetail.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    about: PropTypes.string,
    location: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    website: PropTypes.string,
    job: PropTypes.string,
    pronoun: PropTypes.object,
    imgUrl: PropTypes.any,
    imgUrlSm: PropTypes.string,
    role: PropTypes.arrayOf(
      PropTypes.oneOf([
        'admin',
        'opportunityProvider',
        'volunteer',
        'activityProvider',
        'tester',
        'orgAdmin'
      ])
    ),
    status: PropTypes.oneOf(['active', 'inactive', 'hold']),
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
}

export default PersonDetail
