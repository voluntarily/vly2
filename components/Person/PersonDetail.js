import { Icon, Divider } from 'antd'
import Markdown from 'markdown-to-jsx'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import PersonRoles from './PersonRole'
import {
  GridContainer,
  TextPBold,
  TextH1,
  TextH3,
  TextSubtitle
} from '../VTheme/VTheme'

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  gap: 5rem;
`

const ProfileImage = styled.img`
  width: 100%;
`

const DetailItem = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`

const ListItem = styled.div`
  background-color: none;
  min-height: 5rem;
  margin-bottom: 5rem;
`

const PersonDetail = ({ person }, ...props) => (
  <div>
    <Head title={person.nickname} />
    <ProfileGrid>
      <GridContainer>
        <ProfileImage src={person.avatar} alt={person.nickname} />
        <DetailItem>
          <a href={`mailto:${person.email}`}>
            <Icon type='mail' /> {person.email}
          </a>
        </DetailItem>
        <DetailItem>
          <a href={`tel:${person.phone}`}>
            <Icon type='phone' /> {person.phone}
          </a>
        </DetailItem>
        <p>
          <Icon type='schedule' />{' '}
          {person.status ? <Icon type='check' /> : <Icon type='close' />}
        </p>
      </GridContainer>
      <GridContainer>
        <ListItem>
          <TextH1>{person.name}</TextH1>
          <TextPBold>{person.org}</TextPBold>
          <Divider />
          <TextSubtitle>
            <Markdown children={person.about || ''} />
          </TextSubtitle>
        </ListItem>
        <ListItem>
          <TextH3>Latest Activities</TextH3>
          <Divider />
        </ListItem>
        <ListItem>
          <TextH3>Latest Achievements</TextH3>
          <Divider />
        </ListItem>
        <div>
          <Icon type='coffee' /> <PersonRoles roles={person.role} />
        </div>
      </GridContainer>
    </ProfileGrid>
  </div>
)

PersonDetail.propTypes = {
  person: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    about: PropTypes.string,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    gender: PropTypes.string,
    avatar: PropTypes.any,
    role: PropTypes.arrayOf(
      PropTypes.oneOf([
        'admin',
        'opportunityProvider',
        'volunteer',
        'activityProvider',
        'tester'
      ])
    ),
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }).isRequired
}

export default PersonDetail
