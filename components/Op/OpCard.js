/*
  Display an activity record in card format with a picture, name, and commitment.
*/
// import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'

const getOpPageURL = (isArchived, opid) => {
  if (isArchived) {
    return `/archivedops/${opid}`
  } else {
    return `/ops/${opid}`
  }
}
// todo if image is not present then use a fallback.
const OpCard = ({ size, op, interestStatus }) => {
  const cardImage = op.imgUrl ? op.imgUrl : '../../static/missingimage.svg'
  const draft = op.status === 'draft' ? 'DRAFT: ' : ''
  const isArchived = op.status === 'completed' || op.status === 'cancelled'
  const startTime = op.date[0] ? moment(op.date[0]).format('🗓 h:mmA - ddd DD/MM/YY') : ''
  const startLocation = op.location ? `🏫 ${op.location}` : ''
  const startDuration = op.duration ? `⏱ ${op.duration}` : ''
  return (
    <div>
      <div className={`requestContainer${size}`}>
        <Link href={getOpPageURL(isArchived, op._id)}>
          <a>
            <img className={`requestImg${size}`} src={cardImage} />
            <p className={`requestTitle requestTitle${size}`}>
              {draft}
              {op.name}
            </p>
            <p className={`requestDateTime${size}`}> {startLocation}</p>
            <p className={`requestDateTime${size}`}> {startTime} </p>
            <p className={`requestDateTime${size}`}> {startDuration}</p>
            <p className={`requestDescription${size}`}>
              {op.subtitle}
              <strong>{' - ' + interestStatus}</strong>
            </p>
          </a>
        </Link>
      </div>

      <style jsx>{`
        a {
          text-decoration: none;
        }

        .requestContainerSmall {
          -webkit-transition: all 0.2s;
          width: 18.5rem;
          letter-spacing: -0.3px;
          line-height: 24px;
          padding-bottom: 1rem;
        }

        .requestContainerSmall:hover {
          -webkit-transition: all 0.2s;
          transition: all 0.3s;
          box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.1);
          transform: scale(1.1);
          border-radius: 8px;
        }

        .requestContainerSmall:hover .requestTitleSmall {
          -webkit-transition: all 0.2s;
          transform: scale(0.9091);


        }


        .requestContainerSmall:hover .requestDateTimeSmall {
          -webkit-transition: all 0.2s;
          transform: scale(0.9091);
          font-weight: bold;

        }


        .requestContainerSmall:hover .requestDescriptionSmall {
          -webkit-transition: all 0.2s;
          transform: scale(0.9091);

        }
        .requestContainerSmall:hover .requestImgSmall {
          -webkit-transition: all 0.2s;
          border-radius: 8px 8px 0 0;
      
        }

        .requestContainerBig {

          letter-spacing: -0.3px;
          line-height: 24px;
          margin-bottom: 4rem;
        }

        .requestImgSmall {
          -webkit-transition: all 0.2s;
          width: 100%;
          height: 10rem;
          background-color: rgba(0, 0, 0, 0);
          object-fit: cover;
          overflow: hidden;
          object-position: center;
        }

        .requestImgBig {
          width: 38rem;
          height: 21rem;
          background-color: rgba(0, 0, 0, 0);
          object-fit: cover;
          object-position: center;
        }

        .requestTitle {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          vertical-align: middle;
          color: #000;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

        }

        .requestTitleSmall {
          -webkit-transition: all 0.28s;
          font-weight: 700;
          font-size: 20px;
          line-height: 1.4;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .requestTitleBig {
          font-weight: 600;
          font-size: 1.2rem;
          letter-spacing: -0.8px;
          line-height: 40px;
        }

        .requestDateTimeSmall {
          vertical-align: middle;
          margin-bottom: 0px;
          font-weight: 500;
          font-size: 16px;
          color: #585858;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-block-start: 0;
          -webkit-transition: all 0.28s;
        }

        .requestDateTimeBig {
          vertical-align: middle;
          margin-bottom: 0px;
          font-weight: 400;
          font-size: 1rem;
          color: #585858;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          line-height: 24px;
          letter-spacing: -0.5px;
        }

        .requestDescriptionSmall {
          -webkit-transition: all 0.28s;
          vertical-align: top;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: #585858;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-block-start: 0;
          margin-top: 8px;
    
        }

        .requestDescriptionBig {
          vertical-align: top;
          font-weight: 400;
          font-size: 1rem;
          line-height: 24px;
          color: #000;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          letter-spacing: -0.3px;
        }

        .requestTitle :hover {
          color: #6549aa;
        }

        @media screen and (max-width: 768px) {
          .requestContainerSmall {
            width: calc(100vw - 2rem);
            margin-bottom: 1.5rem;
          }
          .requestContainerBig {
            width: calc(100vw - 4rem);
          }
          .requestImgSmall {
            height: 12rem;
          }
          .requestImgBig {
            width: calc(100vw - 4rem);
          }
        }

        @media screen and (min-width: 768px) and (max-width: 1281px) {
          .requestContainerBig {
            width: calc(50vw - 4rem);
            margin-bottom: 2rem;
          }
          .requestImgBig {
            height: 12rem;
            width: calc(50vw - 5rem);
          }
        }
      `}</style>
    </div>
  )
}

OpCard.propTypes = {
  size: PropTypes.string.isRequired,
  op: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    _id: PropTypes.string.isRequired
  })
}

export default OpCard
