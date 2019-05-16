 import React from 'react'
 import styled from 'styled-components'
 

const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18.5rem 18.5rem 18.5rem 18.5rem;
  grid-gap: 2rem;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, 18.5rem);
    justify-content: start;
    justify-items: center;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: 100vw;
    grid-gap: 0rem;
  }
` // end grid


export default Grid
