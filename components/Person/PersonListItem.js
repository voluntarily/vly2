import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'

const PersonContainer = styled.section`
transition: all 0.25s;

h5 {
  max-width: 18.5rem;
}

a, img {
  align-self: center;
}


:hover {
 h5 {
  color: #6549aa;
}

transform: scale(1.02);
}

img {
  height: 4rem;
  width: 4rem;
  object-fit: cover;
  border-radius: 8px;
}




figcaption {
  word-wrap: break-word;
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 0.5rem;
  padding: 1rem;

  background-color: #fff;
  box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.2);
  border-radius: 8px; 
   



@media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    margin-bottom: 1rem;
  }




  
}



`

const PersonListItem = ({ person }) => (
  <Link href={`/people/${person._id}`}>
    <a target='_blank'>
      <PersonContainer>

        <figcaption>

          <img src={person.imgUrl} />
          <div>
            <h5><strong>{person.name}</strong></h5>
            <p>{person.placeOfWork}</p>
            <p>{person.job}</p>
          </div>
        </figcaption>

      </PersonContainer>
    </a>
  </Link>
)

PersonListItem.propTypes = {
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

export default PersonListItem
