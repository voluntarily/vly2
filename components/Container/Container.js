import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'



export const sectionContainer = styled.div`
/* // Big Screens */
    margin: 0 auto;
    width: 80rem;
    margin-top: 20rem;
    background-color: pink;
  

  /* // Medium Screens */
@media screen and (min-width: 768px) and (max-width: 1680px) {

    width: calc(100vw - 2rem);
    margin-top: initial;
}

/* // Small / Smol Screens & Phones */
@media screen and (max-width: 767px) {

      width: calc(100vw - 4rem);
      margin: 2rem;
    
}  
` //end sectionContainer

const Container = () => (
  
<sectionContainer>


</sectionContainer>


)

Container.propTypes = {
  person: PropTypes.shape({
    name: PropTypes.string.isRequired,
    moniker: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    // type: PropTypes.arrayOf(PropTypes.oneOf(['admin', 'op', 'vp', 'ap', 'other'])).isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default Container
