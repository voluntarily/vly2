import React from 'react'
import styled from 'styled-components'

export const Spacer = styled.div`
  height: 4rem;
` // end spacer

export const HalfGrid = styled.div`
  display: grid;
  grid-template-columns: 39rem 39rem;
  grid-column-gap: 2rem;

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    width: calc(100vw - 4rem);
    grid-template-columns: calc(50vw - 2rem) calc(50vw - 2rem);
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
` // end halfgrid

export const Grid = styled.div`
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
