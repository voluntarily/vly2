/*
  Display an activity record in card format with a picture, title, and commitment.
*/
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

// todo if image is not present then use a fallback.
const OpCard = ({ op, onPress, ...props }) => (
  <div>
    <Link href={`/ops/${op._id}`}>
      <a>
        <div className='requestContainer'>
          <img className='requestImg' src={op.imgUrl} />
          <p className='requestTitle'>{op.title}</p>
          <p className='requestDateTime'>{op.duration}</p>
          <p className='requestDescription'>{op.subtitle}</p>
        </div>
      </a>
    </Link>
    <style jsx>{`
      .requestContainer {
        width: 18.5rem;
        letter-spacing: -0.3px;
        line-height: 24px;
        margin-bottom: 0px;
      }

      .requestImg {
        width: 100%;
        height: 10rem;
        background-color: rgba(0,0,0,0.0);
        object-fit: cover;
        object-position: center;
      }

      .requestTitle {
        margin-top: 0.3rem;
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

      .requestDateTime {
        vertical-align: middle;
        margin-bottom: 0px;
        font-weight: bold;
        font-size: 16px;
        color: #585858;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .requestDescription {
        vertical-align: top;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #000;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .requestTitle :hover {
        color: #6549aa;
      }

      @media screen and (max-width: 768px) {
        .requestContainer {
          width: calc(100vw - 2rem);
          margin-bottom: 1.5rem;
        }
        .requestImg {
          height: 12rem;
        }
      }
    `}</style>
  </div>
)

OpCard.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  onPress: PropTypes.func
}

export default OpCard
