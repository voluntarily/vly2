import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import styled from 'styled-components'

const PersonContainer = styled.section`
width: 100%;

transition: all 0.25s;

h2 {
  max-width: 18.5rem;
  font-size: 1rem;
  line-height: auto;

}

a, img, div {
  align-self: center;

}


:hover {
 h2 {
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
  width: 100%;
  
  word-wrap: break-word;
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 0.5rem;
  padding: 1rem;


  background-color: #fff;
  box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.2);
  border-radius: 8px; 
   

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-bottom: 1rem;
  }


@media screen and (max-width: 375px) {
    grid-template-columns: 1fr;
    margin-bottom: 1rem;
  }




  
}



`

const PersonListItem = ({ person }) => (
  <PersonContainer>
    <Link href={`/people/${person._id}`}>
      <a target='_blank'>

        <figcaption>

          <img src={person.imgUrl} alt='an image of a person' />
          <div>
            <h2><strong>{person.name}</strong></h2>
            <p>{person.placeOfWork}</p>
            <p>{person.job}</p>
          </div>
        </figcaption>

      </a>
    </Link>
  </PersonContainer>
)

PersonListItem.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    job: PropTypes.string,
    placeOfWork: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default PersonListItem
