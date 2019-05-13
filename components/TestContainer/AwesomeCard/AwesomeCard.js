/*
  Display an activity record in card format with a picture, title, and commitment.
*/
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

// todo if image is not present then use a fallback.
const AwesomeCard = ({ op, onPress, ...props }) => (
<div>
  <Link href={`#`} >
    <div className="requestContainer">
      <img className="requestImg"></img>
      <p className="requestTitle">Learn robotics by building a robot doggo a robot doggo a robot doggo a robot doggo a robot doggo cause robotos are cool loooong title haha</p>
      <p className="requestDateTime">Doggos Doggos Doggos Doggos Doggos Doggos Doggos  </p>
      <p className="requestDescription">We need a dogineer</p>
    </div>
   
   </Link>

  <style jsx>{` 
  

.requestContainer {
  width: 18.5rem;
  letter-spacing: -0.3px;
  line-height: 24px;
  margin-bottom: 0px;
}

.requestImg {
  width: 18.5rem;
  height: 10rem;
  background-color: black;
  object-fit: cover;
  object-position: center;

}
 
.requestTitle {
  margin-top: 0px;

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

  `}</style>


</div>

)

AwesomeCard.propTypes = {
  op: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    _id: PropTypes.string.isRequired
  }),
  onPress: PropTypes.func
}

export default AwesomeCard
