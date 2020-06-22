import { defaultToHttpScheme } from '../../lib/urlUtil'
import { Divider, Button } from 'antd'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import MemberUl from '../Member/MemberUl'
import TagDisplay from '../Tags/TagDisplay'
import { ActivityContainer, StyledIcon, H2, H3 } from '../VTheme/VTheme'
import Html from '../VTheme/Html'
import PersonRoles from './PersonRole'
import PersonPronouns from './PersonPronoun'
import { PersonBadgeSection } from './PersonBadge'
import { VBanner, VBannerImg, ProfileBannerTitle } from '../VTheme/Profile'
import Verification from '../Verification/Verification'
import { ParticipationSection } from './ParticipationSection'
import { TopicGroupSection } from './TopicGroupSection'
import { StreetAddressLinkLi } from '../Address/StreetAddress'

const DetailItem = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  @media screen and (max-width: 767px) {
    display: none;
  }
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

const PersonDetail = ({ person, panelEdit, personEdit, canEdit }) => (
  <>
    <Head title={person.nickname} />
    <VBanner>
      <VBannerImg src={person.imgUrl} alt={person.nickname} />
      <ProfileBannerTitle>
        <H2>{person.name}</H2>
        <p>
          {person.job && `${person.job}`}
          {person.placeOfWork && ` - ${person.placeOfWork}`}
        </p>
        {canEdit &&
          <div>
            {personEdit &&
              <Button id='editPersonBtn' type='primary' shape='round' onClick={personEdit}>
                <FormattedMessage id='PersonDetail.edit' defaultMessage='Edit Profile' description='Button to edit a person' />
              </Button>}
            {panelEdit &&
              <Button type='primary' shape='round' onClick={panelEdit}>
                <FormattedMessage
                  id='PersonDetail.panel.edit'
                  defaultMessage='Edit Profile'
                  description='Button to edit an person on PersonDetails page'
                />
              </Button>}
            &nbsp;<Verification />
          </div>}
      </ProfileBannerTitle>
    </VBanner>
    <Divider />
    {canEdit &&
      <>
        <ActivityContainer>
          <H3><FormattedMessage defaultMessage='How to get involved' id='PersonDetail.Participation' description='Participation section header for a person profile' /> </H3>
          <div>
            <ParticipationSection person={person} />
          </div>
        </ActivityContainer>
        <Divider />
        <ActivityContainer>
          <H3><FormattedMessage defaultMessage='Your Interests' id='PersonDetail.TopicGroups' description='TopicGroups section header for a person profile' /> </H3>
          <div>
            <TopicGroupSection person={person} />
          </div>
        </ActivityContainer>
        <Divider />
      </>}
    {(person.about || person.tags) &&
      <>
        <ActivityContainer>
          <H3><FormattedMessage defaultMessage='About' id='PersonDetail.About' description='About section header for a person profile' /> </H3>
          <div>
            {person.about &&
              <div>
                <Html children={person.about} />
                <Divider />
              </div>}
            {person.tags &&
              <div>
                <h5>
                  <FormattedMessage
                    defaultMessage='Interests and Skills'
                    id='PersonDetail.skills.title'
                    description='subheading for tags on person details page'
                  />
                </h5>
                <TagDisplay tags={person.tags} />
              </div>}
          </div>

        </ActivityContainer>
        <Divider />
      </>}
    <ActivityContainer>
      <H3>
        <FormattedMessage
          defaultMessage='Contact'
          id='PersonDetail.Contact'
          description='Heading for contact details on person details page'
        />
      </H3>
      <InfoSection>
        <PersonUl>

          <li>
            <a href={`mailto:${person.email}`}>
              <StyledIcon type='mail' />
              {person.email}
            </a>
          </li>
          {person.phone &&
            <li>
              <a href={`tel:${person.phone}`}>
                <StyledIcon type='phone' />
                {person.phone}
              </a>
            </li>}

          {person.phone && person.address && person.address.addressSummary &&
            <li>
              <StyledIcon type='home' />
              <StreetAddressLinkLi address={person.address.addressSummary} />
            </li>}
          {person.website &&
            <li>
              <a href={defaultToHttpScheme(person.website)} rel='noopener noreferrer' target='_blank'>
                <StyledIcon type='global' />
                {person.website}
              </a>
            </li>}
          {person.facebook &&
            <li>
              <a href={`https://www.facebook.com/${person.facebook}`} rel='noopener noreferrer' target='_blank'>
                <StyledIcon type='facebook' />
                {person.facebook}
              </a>
            </li>}
          {person.twitter &&
            <li>
              <a href={`https://www.twitter.com/${person.twitter}`} rel='noopener noreferrer' target='_blank'>
                <StyledIcon type='twitter' />
                {person.twitter}
              </a>
            </li>}
          {person.locations && person.locations.length > 0 &&
            <li>
              <StyledIcon type='compass' />
              {person.locations.join(', ')}
            </li>}
          {person.pronoun &&
            <li>
              <StyledIcon type='idcard' />
              <PersonPronouns pronoun={person.pronoun} />
            </li>}
          {person.role &&
            <li>
              <StyledIcon type='coffee' />
              <PersonRoles roles={person.role} />
            </li>}
          {person.education &&
            <li>
              <StyledIcon type='book' />
              {person.education}
            </li>}
          {person.placeOfWork &&
            <li>
              <StyledIcon type='bank' />
              {person.placeOfWork}
            </li>}
          {person.job &&
            <li>
              <StyledIcon type='coffee' />
              {person.job}
            </li>}
        </PersonUl>
      </InfoSection>
    </ActivityContainer>
    <Divider />
    <ActivityContainer>
      <H3>
        <FormattedMessage
          id='PersonDetail.subheading.membership'
          defaultMessage='Organisations'
          description='Header for list of orgs I belong to'
        />
      </H3>
      <div>

        {person.orgMembership &&
          <DetailItem>
            <h5>
              <FormattedMessage
                id='PersonDetail.subheading.member'
                defaultMessage='Member of'
                description='Header for list of orgs I follow'
              />
            </h5>
            <MemberUl members={person.orgMembership} />

          </DetailItem>}
        {person.orgFollowership &&
          <DetailItem>
            <h5>
              <FormattedMessage
                id='PersonDetail.subheading.following'
                defaultMessage='Following'
                description='Header for list of orgs I follow'
              />
            </h5>
            <MemberUl members={person.orgFollowership} />
          </DetailItem>}
      </div>
    </ActivityContainer>
    <Divider />
    <ActivityContainer>

      <H3>
        <FormattedMessage
          id='PersonDetail.subheading.achievements'
          defaultMessage='Recognition'
          description='Header for list of badges I have obtained'
        />
      </H3>

      <PersonBadgeSection person={person} />
    </ActivityContainer>

    <Divider />
  </>

)

PersonDetail.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    about: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
    address: PropTypes.shape({
      addressSummary: PropTypes.string
    }),
    email: PropTypes.string,
    phone: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    website: PropTypes.string,
    job: PropTypes.string,
    pronoun: PropTypes.object,
    imgUrl: PropTypes.any,
    imgUrlSm: PropTypes.string,
    placeOfWork: PropTypes.string,
    role: PropTypes.arrayOf(
      PropTypes.oneOf([
        'admin',
        'basic',
        'opportunityProvider',
        'volunteer',
        'activityProvider',
        'support',
        'orgAdmin'
      ])
    ),
    status: PropTypes.oneOf(['active', 'inactive', 'hold']),
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
}

export default PersonDetail
