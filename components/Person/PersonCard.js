import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Card } from '../VTheme/VTheme'

const PersonCard = ({ person }) => (
  <Card>
    <Link href={`/people/${person._id}`}>
      <a>
        <img src={person.imgUrl} />
        <figcaption>
          <h1>{person.nickname}</h1>
          <p className='personName'>{person.name}</p>
        </figcaption>
      </a>
    </Link>
    <style jsx>{`
      .personName {
        overflow: hidden;
        text-overflow: ellipsis; 
        word-wrap: break-word;
        display: inline;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
      }
    `}
    </style>
  </Card>
)

PersonCard.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default PersonCard
