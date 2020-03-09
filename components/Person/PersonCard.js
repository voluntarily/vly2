import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'
import { Icon } from 'antd'

const PersonContainer = styled.section`
height: auto;

img {
  max-height: 8rem;
  border-radius: 8px 0 0 8px;
}

figcaption {
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 1rem;
  margin-bottom: 1rem;

  box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.2);
  border-radius: 8px;
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
            <p>{person.placeOfWork}</p>
            <p>{person.job}</p>
          </a>
        </Link>

      </div>
    </figcaption>

    <section>
      <h5>Contact details</h5>
      {person.phone &&

        <p className='personName'><Icon type='phone' />{person.phone}</p>}
      <p className='personName'><Icon type='mail' />{person.email}</p>
    </section>

    <style jsx>{`
      .personName {
     
        margin-bottom: 0.5rem;
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
    job: PropTypes.string,
    placeOfWork: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default PersonCard
