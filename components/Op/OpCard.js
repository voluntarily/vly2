/*
  Display an activity record in card format with a picture, title, and commitment.
*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import moment from 'moment'

// todo if image is not present then use a fallback.
class OpCard extends Component {
  constructor (props) {
    super(props)
    const { size, op, onPress } = props
    this.op = op
    this.size = size
    this.onPress = onPress
    this.getOpPageURL = this.getOpPageURL.bind(this)
    this.cardImage = op.imgUrl ? op.imgUrl : '../../static/missingimage.svg'
    this.draft = op.status === 'draft' ? 'DRAFT: ' : ''
    this.isArchived = op.status === 'completed' || op.status === 'cancelled'
    this.interestState = op.interest ? ` - ${op.interest.status}` : ''
    this.startTime = op.date[0]
      ? moment(op.date[0]).format('h:mmA | ddd DD/MM/YY')
      : 'Flexible date/time'
  }

  getOpPageURL () {
    if (this.isArchived) {
      return `/archivedops/${this.op._id}`
    } else {
      return `/ops/${this.op._id}`
    }
  }

  render () {
    return (
      <div>
        <Link href={this.getOpPageURL()}>
          <a>
            <div className={'requestContainer' + this.size}>
              <img className={'requestImg' + this.size} src={this.cardImage} />
              <p className={'requestTitle requestTitle' + this.size}>
                {this.draft}
                {this.op.title}
              </p>
              <p className={'requestDateTime' + this.size}>
                {' '}
                📅 {this.startTime}{' '}
              </p>
              <p className={'requestDateTime' + this.size}>
                {this.op.location}
              </p>
              <p className={'requestDateTime' + this.size}>
                {this.op.duration}
              </p>
              <p className={'requestDescription' + this.size}>
                {this.op.subtitle}
                <strong>{this.interestState}</strong>
              </p>
            </div>
          </a>
        </Link>
        <style jsx>{`
          .requestContainerSmall {
            width: 18.5rem;
            letter-spacing: -0.3px;
            line-height: 24px;
            margin-bottom: 0px;
          }

          .requestContainerSmall :hover {
            -webkit-transition: all 0.3s;
            transition: all 0.3s;

            transform: scale(1.04);
          }

          .requestContainerBig {
            width: 38rem;
            letter-spacing: -0.3px;
            line-height: 24px;
            margin-bottom: 4rem;
          }

          .requestImgSmall {
            width: 100%;
            height: 10rem;
            background-color: rgba(0, 0, 0, 0);
            object-fit: cover;
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
            margin-top: 0.3rem;
            margin-bottom: 0px;
            vertical-align: middle;
            color: #000;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .requestTitleSmall {
            font-weight: bold;
            font-size: 16px;
          }

          .requestTitleBig {
            font-weight: 600;
            font-size: 1.5rem;
            letter-spacing: -0.8px;
            line-height: 40px;
          }

          .requestDateTimeSmall {
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

          .requestDateTimeBig {
            vertical-align: middle;
            margin-bottom: 0px;
            font-weight: 600;
            font-size: 1rem;
            color: #585858;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 24px;
            letter-spacing: -0.5px;
          }

          .requestDescriptionSmall {
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
}

OpCard.propTypes = {
  size: PropTypes.string.isRequired,
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
