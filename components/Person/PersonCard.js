import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'

const PersonContainer = styled.section`
height: auto;

img {
  max-height: 8rem;
}

figcaption {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
}

div {
  align-self: center;
}
`

const PersonCard = ({ person }) => (
  <PersonContainer>

    <figcaption>

      <img src={person.imgUrl} />
      <div>
        <Link href={`/people/${person._id}`}>
          <a>
            <h4>{person.name}</h4>
            <p>{person.nickname}</p>
          </a>
        </Link>

      </div>
    </figcaption>

    <p className='personName'>{person.email}</p>
    <p className='personName'>{person.phone}</p>

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
    phone: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default PersonCard
