import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'

const PersonContainer = styled.section`
height: auto;

img {
  max-height: 8rem;
}
`

const PersonCard = ({ person }) => (
  <PersonContainer>
    <Link href={`/people/${person._id}`}>
      <a>
        <img src={person.imgUrl} />
      </a>
    </Link>
    <figcaption>
      <h1>{person.nickname}</h1>
      <p className='personName'>{person.name}</p>

      <p className='personName'>{person.email}</p>
    </figcaption>

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
  </PersonContainer>
)

PersonCard.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,

    email: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default PersonCard
