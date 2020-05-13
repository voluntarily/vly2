import React from 'react'
import styled from 'styled-components'
import { H2, TitleContainerMid } from '../VTheme/VTheme'

const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  margin-bottom: 5rem;
  @media screen and (min-width: 1026px) and (max-width: 1289px) {
    grid-template-columns: 1fr 1fr ;
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    
    grid-template-columns: 1fr ;
    margin: 2rem 0 ;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;


  gap: 0;
    margin: 0 ;
  }
`

const PeopleCard = styled.div`
  
gap:1.5rem;
width: 100%;
text-align: left;
  background: #ffffff;

  -webkit-transition: all 0.2s;
  transition: all 0.2s;

strong {
  font-weight: 700;
}
figcaption {
padding-top: 0.5rem;
display: grid;
grid-template-columns: 4rem 1fr;
grid-column-gap: 0.5rem;

  margin: 0;
width: 100%;

}

  h3 {
    bottom: 0;
    font-size: 1.4rem;
    font-weight: 400;
    font-style: italic;
    letter-spacing: -0.38px;
    line-height: 1.5;
  

    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    margin: 0;
  }
  small {
  font-size: 1rem
}
 img{ 
border-radius: 100px;
}



  /* Tablet */
  @media screen and (min-width: 768px) and (max-width: 1025px) {
    margin: 0 auto 3rem auto;
  width: 70%;
    img{ 

    }
]
   }

  /* Mobile */
  @media screen and (max-width: 768px) {
padding: 2rem;
    
  }

  /* Mobile */
  @media screen and (max-width: 668px) {

   

  h3 {
    bottom: 0;
    font-size: 1.5rem;
  
  }

  }

`

const Testimonial = () => (
  <div>
    <TitleContainerMid>
      <H2>What the community is saying</H2>
    </TitleContainerMid>
    <OfferContainer>

      <PeopleCard>
        <h3>
            I had a great time helping out, and doing good in my community
        </h3>
        <figcaption>
          <img src='https://picsum.photos/56/56' />
          <div><p><strong>Zoe Timbrell</strong></p>
            <p>Napier, New Zealand</p>
          </div>
        </figcaption>
      </PeopleCard>

      <PeopleCard>
        <h3>
            I had a great time helping out, and doing good in my community
        </h3>
        <figcaption>
          <img src='https://picsum.photos/56/56' />
          <div><p><strong>Zoe Timbrell</strong></p>
            <p>Napier, New Zealand</p>
          </div>
        </figcaption>
      </PeopleCard>

      <PeopleCard>
        <h3>
            I had a great time helping out, and doing good in my community
        </h3>
        <figcaption>
          <img src='https://picsum.photos/56/56' />
          <div><p><strong>Zoe Timbrell</strong></p>
            <p>Napier, New Zealand</p>
          </div>
        </figcaption>
      </PeopleCard>
    </OfferContainer>

  </div>

)

export default Testimonial
