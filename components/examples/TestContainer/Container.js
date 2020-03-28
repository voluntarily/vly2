import React from 'react'
import PropTypes from 'prop-types'
// import styled from 'styled-components'
// import style from '../../components/TestContainer/containerStyle.less'

const Container = () => (
  <div>
    <div className='containerStyle' />
    <style jsx>{`
      .containerStyle {
        margin: 0 auto;
        width: 80rem;
        height: 30rem;
        margin-top: 20rem;
      }
      @media screen and (min-width: 768px) and (max-width: 1680px) {
        .containerStyle {
          width: calc(100vw - 2rem);
        }
      }
      @media screen and (max-width: 767px) {
        .containerStyle {
          width: calc(100vw - 4rem);
          margin: 2rem;
        }
      }
    `}
    </style>
  </div>
)

Container.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    // type: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op', OrganisationRole.VOLUNTEER_PROVIDER, OrganisationRole.ACTIVITY_PROVIDER, 'other'])).isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default Container
