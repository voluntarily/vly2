import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

const PersonCard = ({ person, ...props }) => (
  <div>
    <Link href={`/auth/sign-in`} >
      <a>
        <div className='personContainer'>
          <img className='personImg' src={person.avatar} />
          <p className='personTitle'>{person.nickname}</p>
          <p className='personName'>{person.name}</p>
        </div>
      </a>
    </Link>
    <style jsx>{`
      .personContainer {
        width: 10rem;
        letter-spacing: -0.3px;
        line-height: 24px;
        margin-bottom: 0px;
      }

      .personImg {
        width: 100%;
        height: 10rem;
        background-color: rgba(0,0,0,0.0);
        object-fit: cover;
        object-position: center;
        
      }

      .personTitle {
        margin-top: 0px;
        margin-bottom: 0px;
        vertical-align: middle;
        font-weight: bold;
        font-size: 16px;
        color: #000;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
     
      .personTitle :hover {
        color: #6549aa;
      }
      

    `}</style>
  </div>
)

PersonCard.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default PersonCard
