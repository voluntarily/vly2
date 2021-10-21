import PropTypes from 'prop-types'
import React from 'react'
import { PersonRoleIcons } from '../../components/Person/PersonRole'
import { PersonVerificationBadge } from '../../components/Person/PersonVerification'
import { PageBanner } from '../../components/VTheme/VTheme'
import { Avatar } from 'antd'

export const HomeBanner = ({ person, children }) => (
  <PageBanner>
    <article>
      <Avatar
        src={person.imgUrlSm || person.imgUrl}
        size={100}
      />
      <div>
        <h1>{person.name}
          <PersonRoleIcons roles={person.role} />
          <PersonVerificationBadge person={person} />
        </h1>
        {person.nickname && <p>Kia ora, {person.nickname}</p>}
      </div>
    </article>
    {children}
  </PageBanner>
)
HomeBanner.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    job: PropTypes.string,
    placeOfWork: PropTypes.string,
    imgUrl: PropTypes.string
  }).isRequired
}

export default HomeBanner
