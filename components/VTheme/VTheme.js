import styled from 'styled-components'

/*
====================================================

UTILITY, CONTAINERS AND GRIDS ERMAHGERD
Use these objects to move components into a nice grid  and space them out when you need them
Grids have been written to scale responsively
Also if you are working on new grids: https://www.youtube.com/watch?v=XtAhISkoJZc
(╯°□°)╯︵ ┻━┻  Grids > Tables (╯°□°)╯︵ ┻━┻

====================================================
*/

export const SpacerSmall = styled.div`
  height: 0.5rem;
`

export const Spacer = styled.div`
  height: 4rem;
` // end spacer

export const HalfGrid = styled.div`
  display: grid;
  position: relative;
  margin: 0;
  grid-template-columns: 39rem 39rem;
  grid-column-gap: 2rem;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: calc(50vw - 4rem) calc(50vw - 4rem);
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
` // end halfgrid
export const HalfGridContainer = styled.div``

export const TripleGrid = styled.div`
  display: grid;
  grid-template-columns: 25rem 25rem 25rem;
  grid-gap: 2.5rem;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, 25rem);
    justify-content: start;
    justify-items: center;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: 98vw;
    grid-gap: 0rem;
  }
` // end triplegrid

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

export const GridContainer = styled.div``

export const GridTestItem = styled.div`
  background-color: pink;
`

/*
====================================================

TEXT OBJECTS OMGLOL
These text classes are used to maintain consistency across the entire platform
I have done a terrible example so far, but will aim to fix usage soon
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
  color: black;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -0.055em;
  text-indent: -0.03em;
  margin-bottom: 0px;

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    font-size: 2.5rem;
    letter-spacing: -0.1rem;
  }

  @media screen and (max-width: 768px) {
    font-size: 2rem;
    width: 90vw;
    margin-right: initial;
    letter-spacing: -0.03em;
  }
` // End TextH1

export const TextSubtitle = styled.p`
  letter-spacing: -0.3px;
  font-size: 1.5rem;
  color: #333333;

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    letter-spacing: -0.06rem;
    font-size: 1.5rem;
  }
  @media screen and (max-width: 768px) {
    width: 90vw;
    font-size: 1rem;
  }
` // TextSubtitle

export const TextP = styled.p`
  font-weight: 400;
  color: black;
  font-size: 1rem;
  margin: initial;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end TextP

export const TextPBold = styled.p`
  font-weight: 700;
  color: black;
  font-size: 1rem;
  margin: initial;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end TextBold

export const TextHeading = styled.p`
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: -0.04em;
  margin: initial;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end TextHeading

export const TextHeadingBlack = styled.h1`
  font-size: 2rem;
  letter-spacing: -1px;
  font-weight: 900;
  line-height: 40px;
  margin: initial;
  @media screen and (max-width: 767px) {
    font-size: 2rem;
  }
` // end TextHeadingBlack

export const TextHeadingBold = styled.p`
  font-size: 2rem;
  letter-spacing: -2px;
  font-weight: 700;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end TextHeadingBold

export const TextHeadingSubtitle = styled.p`
  line-height: 2;
  font-size: 1.1rem;
  letter-spacing: -0.2px;
  @media screen and (max-width: 768px) {
    line-height: 1.8;
  }
` // end TextHeadingSubtitle

/*
====================================================

CONTAINER CLASSES
We use these to contain th

We probably don't need this...
^__^

====================================================
*/
