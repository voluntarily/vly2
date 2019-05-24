import styled from 'styled-components'

/*
====================================================

UTILITY AND GRIDS ERMAHGERD
Use these objects to move components into a nice grid  and space them out when you need them

(╯°□°)╯︵ ┻━┻  Grids > Tables (╯°□°)╯︵ ┻━┻

====================================================
*/

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

/*
====================================================

TEXT OBJECTS OMGLOL
These text classes are used to maintain consistency across the entire platform
I've been a terrible example so far, but will aim to fix usage soon
-Walt
^__^

====================================================
*/

export const TextBigTitle = styled.h1`
  font-weight: 900;
  font-size: 6rem;

  @media screen and (max-width: 767px) {
    font-size: 3rem;
  }
` // end TextBigTitle

export const TextH1 = styled.h1`
  font-weight: 900;
  font-size: 4rem;
  @media screen and (max-width: 767px) {
    font-size: 2rem;
  }
` // end TextH1

export const TextP = styled.p`
  font-weight: 400;
  font-size: 1rem;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end TextP

export const TextBold = styled.p`
  font-weight: 700;
  font-size: 1rem;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end TextBold

export const TextHeading = styled.p`
  font-size: 2rem;
  font-weight:400;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` //end TextHeading

export const TextHeadingBold = styled.p`
  font-size: 2rem;
  font-weight:700;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` //end TextHeadingBold

/*
====================================================

HERO CLASSES
Not the RPG Kind, but the ones we use for landing pages
and the ones that

^__^

====================================================
*/


