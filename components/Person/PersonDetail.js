import { Divider, Icon } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import MemberUl from '../Member/MemberUl'
import TagDisplay from '../Tags/TagDisplay'
import { GridContainer, H1, H3Bold, PBold, Spacer, SpacerSmall } from '../VTheme/VTheme'
import PersonRoles from './PersonRole'
import PersonPronouns from './PersonPronoun'

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
  width: 100%;
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

const ListItem = styled.div`
  background-color: none;
  min-height: 5rem;
  margin-bottom: 3rem;
`
const personPronoun = (
  <FormattedMessage
    id='personPronoun'
    defaultMessage='Pronoun'
    description='person pronoun label in personDetails Form'
  />
)

const PersonDetail = ({ person }, ...props) => (
  <ProfileGrid>
    <GridContainer>
      <Head title={person.nickname} />
      <ProfileImage src={person.imgUrl} alt={person.nickname} />
      <DetailItem>
        <Icon type='history' /> 312 ops completed
      </DetailItem>
      <DetailItem>
        <Icon type='safety' /> School Safe
      </DetailItem>
      { person.orgMembership &&
        <DetailItem>
          <h3><FormattedMessage id='person.memberof' defaultMessage='Member of' description='Header for list of orgs I belong to' /></h3>
          <MemberUl members={person.orgMembership} />
        </DetailItem>}
      { person.orgFollowership &&
        <DetailItem>
          <h3><FormattedMessage id='person.following' defaultMessage='Following' description='Header for list of orgs I follow' /></h3>
          <MemberUl members={person.orgFollowership} />
        </DetailItem>}
    </GridContainer>
    <GridContainer>
      <ListItem>
        <H1>{person.name}</H1>
        <PBold>{person.org}</PBold>
        <Divider />
        <Markdown children={person.about || ''} />

        <PBold>
          <a href={`mailto:${person.email}`}>
            <StyledIcon type='mail' /> {person.email}
          </a>
        </PBold>
        <SpacerSmall />
        <PBold>
          <a href={`tel:${person.phone}`}>
            <StyledIcon type='phone' /> {person.phone}
          </a>
        </PBold>
        <SpacerSmall />
        <PBold>
          <a href={person.website} target='_blank' >
            <StyledIcon type='global' /> {person.website}
          </a>
        </PBold>
        <SpacerSmall />
        <PBold>
          <a href={`https://www.facebook.com/${person.facebook}`} target='_blank' >
            <StyledIcon type='facebook' /> {person.facebook}
          </a>
        </PBold>
        <SpacerSmall />
        <PBold>
          <a href={`https://www.twitter.com/${person.twitter}`} target='_blank' >
            <StyledIcon type='twitter' /> {person.twitter}
          </a>
        </PBold>
        <SpacerSmall />
        <PBold>
          <a>
            <StyledIcon type='compass' /> {person.location}
          </a>
        </PBold>
        <SpacerSmall />
        <PBold>
          <a>
            <StyledIcon type='tags' />
          </a>
        </PBold>
        <TagDisplay tags={person.tags} />
      </ListItem>
      <SpacerSmall />
      <DetailItem><PersonPronouns message={personPronoun} pronoun={person.pronoun} /></DetailItem>
      <DetailItemMobile>
        <p>        <Icon type='history' /> 312 ops completed</p>
      </DetailItemMobile>
      <DetailItemMobile>
        <p> <Icon type='safety' /> School Safe</p>
      </DetailItemMobile>
      <Spacer />
      <ListItem>
        <H3Bold>Latest Activities</H3Bold>
        <Divider />
      </ListItem>
      <ListItem>
        <H3Bold>Latest Achievements</H3Bold>
        <Divider />
      </ListItem>
      <div>
        <Icon type='coffee' /> <PersonRoles roles={person.role} />
      </div>
    </GridContainer>
  </ProfileGrid>

)

PersonDetail.propTypes = {
  person: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    about: PropTypes.string,
    location: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    facebook: PropTypes.string,
    twitter: PropTypes.string,
    website: PropTypes.string,
    pronoun: PropTypes.object,
    imgUrl: PropTypes.any,
    role: PropTypes.arrayOf(
      PropTypes.oneOf([
        'admin',
        'opportunityProvider',
        'volunteer',
        'activityProvider',
        'tester'
      ])
    ),
    status: PropTypes.oneOf(['active', 'inactive', 'hold']),
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        tag: PropTypes.string.isRequired,
        _id: PropTypes.string
      })
    )
  }).isRequired
}

export default PersonDetail
