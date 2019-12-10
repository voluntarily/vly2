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

export const PageHeaderContainer = styled.div`
  margin: 8rem 0 2rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media screen and (max-width: 767px) {
    margin-top: 4rem;
    grid-template-columns: calc(100vw - 2rem);
    grid-gap: 0rem;
  }
`

export const RequestButtonContainer = styled.div`
  justify-self: end;
  @media screen and (max-width: 767px) {
    margin-top: 1rem;
    justify-self: start;
  }
`

export const SpacerSmall = styled.div`
  height: 0.5rem;
`

export const Spacer = styled.div`
  height: 4rem;
` // end spacer

export const ControlGrid = styled.div`
display: grid;
grid-template-columns: 5fr 2fr;

align-self: center;

@media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: 1fr 13rem;
    grid-column-gap: 2rem;
  }


@media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }

`

export const OpSectionGrid = styled.div`
  margin: 2rem 0;
  display: grid;
  grid-template-columns: 25rem 1fr;
  gap: 5rem;
  text-align: left;
  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: calc(50vw - 4rem) calc(50vw - 4rem);
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
`// end OpSection

export const HalfGrid = styled.div`
  display: grid;
  position: relative;
  margin: 0;
  grid-template-columns: 39rem 39rem;
  grid-column-gap: 2rem;
  margin: 8rem 0 4rem 0;

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
    grid-template-columns: calc(100vw - 2rem);
    grid-gap: 0rem;
  }
` // end triplegrid

export const Grid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18.5rem 18.5rem 18.5rem 18.5rem;
  grid-gap: 2rem;
  overflow: visible;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, 18.5rem);
    justify-content: start;
    justify-items: center;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: calc(100vw - 2rem);
    grid-gap: 0rem;
  }
` // end grid

export const ActivityGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 18.5rem 18.5rem 18.5rem;
  grid-gap: 2rem;
  overflow: visible;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, 18.5rem);
    justify-content: start;
    justify-items: center;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: calc(100vw - 2rem);
    grid-gap: 0rem;
  }
` // end activitygrid

export const Grid8 = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(8, 10rem);
  grid-gap: 2rem;

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(auto-fit, 10rem);
    justify-content: start;
    justify-items: center;
  }
` // end grid

export const GridContainer = styled.div`
  position: relative;
`

export const ActivityContainer = styled.div`
  display: grid;
  grid-template-columns: 17.5rem 1fr;
  gap: 2.5rem;
  @media screen and (max-width: 1280px) {
    grid-template-columns: calc(100vw - 4rem);
  }
`

export const GridTestItem = styled.div`
  background-color: pink;
`

export const Section = styled.section`
  margin-bottom: 2rem;
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
  line-height: 1;
  letter-spacing: 0.03rem;

  @media screen and (max-width: 767px) {
    font-size: 3rem;
  }
` // end TextBigTitle

export const H1 = styled.h1`
  color: black;
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -0.1rem;
  line-height: 1.5;
  margin-bottom: 0px;
  margin-top: 0px;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    font-size: 2rem;
    line-height: 1.5;
    letter-spacing: -0.02em;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    font-size: 2rem;
    letter-spacing: -0.05rem;
    line-height: 3.75rem;
  }

  @media screen and (max-width: 768px) {
    font-size: 2rem;
    margin-right: initial;
    letter-spacing: -0.03em;
    line-height: 3rem;
  }
` // End H1

export const H3 = styled.h3`
  font-size: 2rem;
  font-weight: 400;
  letter-spacing: -0.04em;
  margin: initial;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    font-size: 1.7rem;
    letter-spacing: -0.02em;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    font-size: 1.2rem;
    letter-spacing: -0.02em;
  }
  @media screen and (max-width: 767px) {
    font-size: 1rem;
    letter-spacing: -0.02em;
  }
` // end TextHeading

export const H3Bold = styled.h3`
  font-size: 2rem;
  letter-spacing: -1.4px;
  font-weight: 700;
  margin-bottom: 0;
  color: black;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    font-size: 1.7rem;
    letter-spacing: -0.02em;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    font-size: 1.2rem;
    letter-spacing: -0.02em;
  }
  @media screen and (max-width: 767px) {
    font-size: 1rem;
    letter-spacing: -0.8px;
  }
` // end H3Bold

export const H3Black = styled.h3`
  font-size: 2rem;
  letter-spacing: -1px;
  font-weight: 900;
  line-height: 40px;
  margin: initial;
  @media screen and (max-width: 767px) {
    font-size: 2rem;
  }
` // end H3Black

export const H4 = styled.h4`
  letter-spacing: -0.3px;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 0;

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    letter-spacing: -0.06rem;
    font-size: 1.5rem;
  }
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
` // H4

export const H5 = styled.h5`
  line-height: 2;
  font-size: 1.1rem;
  color: #333;
  letter-spacing: -0.2px;
  @media screen and (max-width: 768px) {
    line-height: 1.5;
  }
` // end H5

export const P = styled.p`
  font-weight: 400;
  color: black;
  font-size: 1rem;
  margin: initial;
  letter-spacing: -0.03rem;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end P

export const PBold = styled.p`
  font-weight: 700;
  color: black;
  font-size: 1rem;

  margin: initial;
  @media screen and (max-width: 767px) {
    font-size: 1rem;
  }
` // end PBold

export const BigQuote = styled.h2`
  font-size: 3rem;
  letter-spacing: -0.05rem;
  font-weight: 300;
  font-style: italic;
  margin-bottom: 0.5rem;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
    letter-spacing: -0.05rem;
    line-height: 1.5;
  }
` // end BigQuote

export const BigQuoteAuthor = styled.p`
  color: #222;
  font-size: 1.5rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 0;
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    letter-spacing: -0.05rem;
    line-height: 1.5;
  }
`

/*
====================================================

CONTAINER CLASSES
We use these to contain components and nudge them around

Will refactor all the containers in here soon :)

Need the form ones as well soon as we create other forms on top of the OpDetailForm component work :L

^__^

====================================================
*/
export const A4 = styled.div`
  margin: 3em;
  padding-bottom: 4em;
  max-width: 50em;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    .div {
      margin: 0 3em;
    }
  }
`
export const FullPage = styled.div`
  margin: 6rem auto;
  width: 80rem;
  overflow: visible;
  height: auto;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100vw - 4rem);
    margin-left: 2rem;
    margin-right: 2rem;
  }
  @media screen and (max-width: 767px) {
    margin-top: 4rem;
    width: calc(100vw - 2rem);
  }
` // end fullpage

export const FillWindow = styled.div`
  min-height: calc(100vh - 220px);
`
/* Styled Card - an image followed by a title and some content
*/
export const Card = styled.figure`

-webkit-transition: all 0.28s;
padding-bottom: 1rem;

a { text-decoration: none; }

figcaption {
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}

:hover {
  transition: all 0.3s;
  box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.1);
  transform: scale(1.1);
  border-radius: 8px;
  h1 {
    color: #6549aa;
  }
  img {
    border-radius: 8px 8px 0 0;
  }
  figcaption {
    transform: scale(0.9091);
  }
}

h1 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  vertical-align: middle;
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  -webkit-transition: all 0.28s;
  transition: all 0.28s;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.4;
  -webkit-line-clamp: 3;

}

img {
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
  width: 100%;
  height: auto;
  max-height: 10rem;
  background-color: rgba(0, 0, 0, 0);
  object-fit: cover;
  overflow: hidden;
  object-position: top;

  @media screen and (max-width: 768px) {
    height: 12rem;
  }
}

time {
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
}
`

/* Item lists - tidy listings
*/
export const Ul = styled.ul`
  margin: 1.5rem 0 1rem 0;
  padding-left: 0;
  list-style: none;
`
export const Li = styled.li`
  list-style: none;
  font-weight: 500;
  font-size: 1rem;
  opacity: 1;
  color: initial;
  margin-bottom: 0.3rem;
`
