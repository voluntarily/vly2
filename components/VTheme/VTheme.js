import styled from 'styled-components'
import { Tag, Icon } from 'antd'

/*
====================================================

UTILITY, CONTAINERS AND GRIDS ERMAHGERD
Use these objects to move components into a nice grid  and space them out when you need them
Grids have been written to scale responsively
Also if you are working on new grids: https://www.youtube.com/watch?v=XtAhISkoJZc
(╯°□°)╯︵ ┻━┻  Grids > Tables (╯°□°)╯︵ ┻━┻

====================================================
*/

export const PageBanner = styled.div`
 width: auto;
  margin: 0 0 2rem 0;
  display: inline-block;
/* 
  padding: 1rem;
  box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.7);
  border-radius: 8px; */

article {
  display: grid;
  grid-template-columns: 5rem 1fr;
}


img{
    width: 5rem;
    height: 5rem;
    object-fit: cover;
    border-radius: 100%;
    align-self: center;
  }

div{
  margin-left: 1rem;
  margin-right: 3rem;
  align-self: center;
}

h1 {
  align-self: center;
  font-size: 1.5rem;
  line-height: 1;
  margin-bottom: 0.25rem;
}
p {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

 
  @media screen and (max-width: 767px) {
    article {

    grid-gap: 0rem;
  }
  div {

  margin-right: 0;
  }
  }
`
export const AlertContainer = styled.div`
margin-top: 3.5rem;
width: 100%;
background-color: #ffcc00;
height: auto;
min-height: 2rem;
padding: 1rem;
font-size: 1.5rem;
font-weight: 700;
color: black;
`

export const PageBannerNoTabs = styled.div`
  margin: 8rem 0 2rem 0;
  display: grid;
  grid-template-columns: 1fr 14rem;
  padding-bottom: 1rem;
  border-bottom: thin solid  #e8e8e8;
  @media screen and (max-width: 767px) {
    margin-top: 4rem;
    grid-template-columns: calc(100vw - 2rem);
    grid-gap: 0rem;
  }
`

export const PageBannerButtons = styled.div`

 width: 100%;
 margin-top: 1rem;

  @media screen and (max-width: 767px) {
    
    margin-top: 1rem;
    
  }
`

export const InfoSection = styled.article`


h1 {
  font-weight: 600;
  font-size: 4rem;
  letter-spacing: -1.2px;
}

p {
  font-size: 1.25rem;
  max-width: 800px;
  color: black;
}


ul {
  padding: 0;
}
li {
  list-style: none;

}



@media screen and (min-width: 768px) and (max-width: 1281px) {

  }


@media screen and (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  p {
 max-width: calc(100vw - 2rem);
  font-size: 1.2rem;
}

  }

`
export const TermsButtonContainer = styled.div`

max-width: 320px;
@media screen and (max-width: 768px) { 
  margin-left: -1rem;
max-width: initial;
width: 100vw;

background-color: white;
div{ 
  
  margin: 2rem;
}

position: fixed;
bottom: 0;
}
`

export const InfoItem = styled.div`
display: grid;

  margin: 2rem 0 2rem 0;
grid-template-columns: 4rem 1fr;
align-items: center;
column-gap: 0rem;
row-gap: 3rem;


@media screen and (max-width: 768px) {

  grid-template-columns: 1fr;
  gap: 0.5rem;
  p {
 max-width: calc(100vw - 2rem);
  font-size: 1rem;
  margin-bottom: 2rem;
}

  }

`

export const HeroSectionHeader = styled.div`
display: grid;

grid-template-columns: 1fr 12rem;
margin: 4rem 0 3rem 0;


@media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  margin: 2rem 0;
  }

`
export const HeroSectionButtonContainer = styled.div`
@media screen and (max-width: 768px) {
    display: none;
  }
`
export const EmptyContainer = styled.section`
display: flex;
justify-content: center;
align-self: center;
text-align: center;
h3 {
  margin-top: 1rem;

}
img {
  max-height: 15rem;

}
div {
  display: flex;
  flex-direction: column;
padding: 2rem;
min-height: 50vh
max-width: 40rem;
}
button {
  margin-bottom: 1rem;
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
margin: 2rem 0 1rem 0;

align-self: center;
strong {
  font-weight: 700;
}

@media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: 1fr 13rem;
    grid-column-gap: 2rem;
  }


@media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }

`
export const SmallOpGrid = styled.div`
display: grid;
grid-template-columns: 4rem 1fr;
gap: 0.5rem;
align-items: center;
strong {
  font-weight: 700;
}
i {
  font-size: 0.8rem;
  color: #777;
}
`

export const OpSectionGrid = styled.div`
  margin: 2rem 0;
  display: grid;
  grid-template-columns: 1fr 50rem;
  grid-column-gap: 5rem;
  grid-row-gap: 2rem;
  text-align: left;
  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: 1fr;
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    gap: 0;
    grid-template-columns: calc(100vw - 2rem);
  }
`// end OpSection

export const HalfGrid = styled.div`
  display: grid;
  position: relative;
  margin: 0;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 4rem;
  padding: 4rem 0 ;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
` // end halfgrid
export const HalfGridContainer = styled.div``

// 30% left, 60% right two column
export const SideBarGrid = styled.div`
  display: grid;
  position: relative;;
  grid-template-columns: 29rem auto;
  grid-column-gap: 2rem;
  margin: 1rem 0 2rem 0 ;

  @media screen and (min-width: 768px) and (max-width: 1281px) {
    grid-template-columns: calc(40vw - 4rem) calc(60vw - 4rem);
    grid-column-gap: 2rem;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: calc(100vw - 2rem);
  }
`

// end halfgrid
export const TripleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2.5rem;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    margin: 0 auto;
    grid-template-columns: repeat(auto-fit, 25rem);
    justify-content: center;
    justify-items: center;
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: 1fr;
    grid-row-gap: 2rem;
    grid-gap: 0rem;
  }
` // end triplegrid

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 1.5rem;
  grid-row-gap: 2rem;
  overflow: visible;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    grid-template-columns: 1fr 1fr 1fr;

  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
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

export const DescriptionWrapper = styled.p`
margin: 0.5rem 0;
color: #333;
i {
  font-size: 0.8rem;
  color: #999;
}
`

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

export const SectionContainer = styled.section`
  margin: 8rem 0;
  position: relative;

 

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    margin-top: 5rem;
    margin-bottom: 5rem;
  }
  @media screen and (max-width: 768px) {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    width: calc(100vw - 2rem);


  }
  `

export const GridTestItem = styled.div`
  background-color: pink;
`

export const Section = styled.section`
  margin-bottom: 2rem;
`
export const ContentCard = styled.div`
  background-color: #ffffff;
  box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
  border-radius: 8px;
  width: 100%;
  padding: 1rem;
  text-align: left;

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: -0.38px;
    line-height: 32px;

    margin-bottom: 1rem
  }

  h4 {
    font-size: 1.25rem;
    font-weight: 400;
    letter-spacing: -0.38px;
    line-height: 32px;

    margin-bottom: 1rem
  }

  p {

  }

  img {
    height: 2rem;
    width: 2rem;
    object-fit: cover;
    object-position: center;

    border-radius: 150px;
  }
`
export const TitleContainerMid = styled.div`
margin: 0 auto;
padding: 2rem 0 4rem 0;
text-align: center;
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

export const TextPromo = styled.p`
font-size:1.5rem;
font-weight: 400;
letter-spacing: -0.035rem;
`

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
`
// End H1

// Start H2
export const H2 = styled.h2`
font-style: normal;
font-weight: 500;
font-size: 2.5rem;
line-height: 3.5rem;
letter-spacing: -1.1px;
margin: 0;
padding: 0;
color: #000000;
@media screen and (min-width: 1026px) and (max-width: 1281px) {
    font-size: 2rem;
    line-height: 1.5;
    letter-spacing: -0.02em;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    font-size: 2rem;
    letter-spacing: -0.05rem;

line-height: 1.5;
  }

  @media screen and (max-width: 768px) {

line-height: 1.5;
    font-size: 2rem;
    margin-right: initial;
    letter-spacing: -0.03em;
  }

`

export const H3 = styled.h3`


    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: -0.3px;
    color: #333;
 
  margin: 0;
  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    font-size: 1.4rem;
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
  line-height: 1.5;
  font-size: 1.2rem;
  color: #000;
  letter-spacing: -0.2px;
  margin: 0;

  strong {
    font-weight: 700;
  }
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
export const ContactIcon = ({ type }) =>
  <Icon
    // theme='twoTone'
    twoToneColor='blue'
    type={type}
    style={{ marginRight: '0.5rem', fontSize: '1rem', color: '#6549AA' }}
  />
/*
====================================================

CONTAINER CLASSES
We use these to contain components and nudge them around

Will refactor all the containers in here soon :)

Need the form ones as well soon as we create other forms on top of the OpAskForm component work :L

^__^

====================================================
*/
export const A4 = styled.div`
  margin: 3rem;
  padding: 4rem,0;
  max-width: 50em;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    .div {
      margin: 0 3em;
    }
  }
`
// narrow page used for notices
export const A5 = styled.div`
  margin: 3em;
  padding: 4em;
  max-width: 40rem;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 600px) {
    .div {
      margin: 0 3em;
    }
  }
`

/* FullPage is the generic page wrapper providing wide margins
  so that the page looks like a piece of paper.
*/
export const FullPage = styled.div`
  margin: 6rem auto;
  max-width: 80rem;
  overflow: visible;
  height: auto;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100vw - 4rem);
    margin-left: 2rem;
    margin-right: 2rem;
  }
  @media screen and (max-width: 767px) {
    margin: 4rem auto;
    width: calc(100vw - 2rem);
  }
` // end fullpage

export const Portrait = styled.section`
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

export const Landscape = styled.section`
  margin: 6rem 2rem;
  overflow: visible;
  height: auto;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    // width: calc(100vw - 4rem);
    margin-left: 2rem;
    margin-right: 2rem;
  }
  @media screen and (max-width: 767px) {
    margin-top: 4rem;
    // width: calc(100vw - 2rem);
  }
` // end fullpage

export const FillWindow = styled.div`
  min-height: calc(100vh - 220px);
`
/* Styled Card - an image followed by a title and some content
*/
export const Card = styled.figure`

padding-bottom: 0.5rem;

-webkit-transition: all 0.2s;
  transition: all 0.2s;
p {
  margin: 0.25rem 0 -0.1rem 0;
  color: #555;
}
a { text-decoration: none; }

figcaption {

  li { list-style: none; margin-bottom: 0.2rem;
   }
  ul { 
    padding-left: 0;
    margin: 1rem 0 0 0;

   }
}

:hover {
  box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.1);
  transform: scale(1.04);
  border-radius: 8px;
 p, ul {
   color: black;
 }
  h1 {

  color: #6549aa;
  }

  img {
    border-radius: 8px 8px 0 0;
  }
  figcaption {
    transform: scale(0.94);

  }
}

figcaption {

-webkit-transition: all 0.2s;
  transition: all 0.2s;
}
img {
  border-radius: 8px;
}
h1 {
  margin: 0.25rem 0;
  font-size: 1.4rem;
  vertical-align: middle;
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 700;
  line-height: 1.4;
  -webkit-line-clamp: 3;

}

img {
  width: 100%;
  height: 10rem;
  max-height: 10rem;
  background-color: rgba(0, 0, 0, 0);
  object-fit: cover;
  overflow: hidden;
  object-position: center;

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

/* Small Card - an image followed by a title and some content
*/
export const SmallCard = styled.figure`

-webkit-transition: all 0.28s;
transition: all 0.28s;
box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.1);
padding: 1rem;
border-radius: 8px;
margin-bottom: 0;
overflow: auto;

p {margin: 0}
a { text-decoration: none; }
li { list-style: none }
  ul { padding-left: 0;
  margin: 0; }


:hover {
  transform: scale(1.02);
  border-radius: 8px;
  h2 {
    color: #6549aa;
  }
 
 
}

h2 {
 
  font-size: 1rem;
  vertical-align: middle;
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  -webkit-transition: all 0.28s;
  transition: all 0.28s;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.4;
}

img {
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
 
  border-radius: 129px;
  width: 4rem;
  height: 4rem;
 
  background-color: rgba(0, 0, 0, 0);
  object-fit: cover;
  overflow: hidden;
  object-position: top;
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

/* Fix for Op heading alignment */

export const BannerDetail = styled.div`
display: grid;
align-self: center;

ul {
  

}
small {
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
@media screen and (max-width: 768px) {
  margin-top: 0.5rem;
}
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
export const DocumentList = styled.li`
    transition: all 0.3s;
    list-style: none;
    padding: 1rem;
    margin: 0 0 1.5rem 0;
    box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
    border-radius: 8px;
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 1rem;  

    img {
      height: 2rem;
      align-self: center;
    }

      :hover {
  
        box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.1);
        transform: scale(1.01);
        border-radius: 8px;
        p {
          color: #653cad;
        }
      }

`

// Promo card for topics on landing page
export const PromoCard = styled.article`

transition: all 0.3s;
img{
  border-radius: 8px;
}
a {
  color: #653cad;
}

:hover {
  transform: scale(1.04);
}
`
// Stat container for landing page with checks
export const StatContainer = styled.div`
margin: 2rem 0;
display: grid;
align-self: center;
grid-template-columns: 2rem 1fr;
grid-column-gap: 1rem;
grid-row-gap: 1.5rem;
p {
  align-self: center;
}


`

// we use this tag for categories
export const TagStyle = styled(Tag)`
width: auto;
max-width: 100%;
overflow-wrap: break-word;
white-space: pre-wrap; 


padding: 0.2rem 0.5rem;
margin: 0.1rem;
vertical-align: middle;
font-size: 1.2rem;
font-weight: 500;
background-color: #e8e8e8;
`
// we use this tag for op state
export const TagState = styled.span`
left: 0.5rem;
  position: absolute;
  padding:0.2rem 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 8px;
  margin: 0.5rem 0 0 0;
`

export const StyledIcon = styled(Icon)`
  margin-right: 0.5rem;
`
/* Contact list displayed for organisations */

export const ContactList = styled.ul`
  display: grid;
  grid-template-columns: 45% 45%;
  grid-column-gap: 5%;
  padding: 0;

  @media screen and (min-width: 767px) {
    grid-template-columns: 30% 30% 30%;
    grid-column-gap: 3%;
  }

  li {
    list-style: none;
    color: black;
    font-weight: 700;
    margin-bottom: 2rem;

    a {
      font-size: 1rem;
      overflow-wrap: break-word;

      @media screen and (min-width: 767px) {
        font-size: 1rem;
      }

      @media screen and (min-width: 988px) {
        font-size: 1.2rem;
      }
    }
  }
`

/* dark banner across the page containing important information
  e.g you have been invited - or event has been cancelled.
  main text inside should contain an h4 title.
*/
export const PageAlert = styled.div`

  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  box-shadow: 1px 1px 12px 2px rgba(10,10,10,0.1);

  display: grid;
  gap: 1rem;
  grid-template-columns: 3rem 3fr 1fr;

  background-color: rgb(37, 15, 81);
  margin: 0rem;
  h4 {
    color: white;
    font-weight: 600;
  }


`

// imagecontainer for halfgrid
export const ImageContainer = styled.img`
width: 100%;

@media screen and (min-width: 768px) and (max-width: 1281px) {
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    width: 50%;
  }
`

export const OfferCard = styled.div`
  
display: grid;
gap:1.5rem;
grid-template-columns: 1fr;
width: 100%;
text-align: center;
  background: #ffffff;

  -webkit-transition: all 0.2s;
  transition: all 0.2s;

figcaption {
  position: relative;

  margin: 0;
height: 100%;

}

  h3 {
    bottom: 0;
    font-size: 1.4rem;
    font-weight: bold;
    letter-spacing: -0.38px;
    line-height: 1.5;
    color: #653cad;

    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
  }
  small {
  font-size: 1rem
}
 img{ 
   margin-bottom: 1rem;
  width: 100%;
  max-height: 10rem;
  
}

  :hover {
    transform: scale(1.01);
    h3 {
      color: #653cad;
    }
  }

  /* Tablet */
  @media screen and (min-width: 768px) and (max-width: 1280px) {

    min-height: 10rem;
    figcaption {
      display: grid;
      grid-column-gap: 2rem;
      grid-template-columns: 1fr 2fr;
  
    }
    div {
      align-self: center;
      text-align: left;
    }
    
    img{ 
  height: 100%;
  align-self: center;
  justify-self: end;
  
    }
    p {
      width: 100%;
      margin: 0 auto;
    }
   }

  /* Mobile */
  @media screen and (max-width: 768px) {
   
    
  }

  /* Mobile */
  @media screen and (max-width: 668px) {
 

    width: calc(100vw - 2rem);
    text-align: center;
   

  h3 {
    bottom: 0;
    font-size: 1.5rem;
  
  }
  p {
    max-width: 70vw;
    font-size: 1rem;
    margin: 0 auto 1rem auto;
  }

  }

`
