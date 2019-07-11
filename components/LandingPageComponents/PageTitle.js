import React, { Children } from 'react'
import styled from 'styled-components'

const PageTitleContainer = styled.div`
  width: auto;
  margin: 3rem 0 5rem 0;

  @media (min-width: 1025px) and (max-width: 1280px) {
    /*   #Device = Laptops, Desktops  #Screen = B/w 1025px to 1280px */
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    /* #Device = Tablets, Ipads (portrait) #Screen = B/w 768px to 1024px */
  }

  @media (min-width: 320px) and (max-width: 480px) {
    margin: 1rem 0 2rem 0;
  }

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    margin: 0.5rem 0 2rem 0;
  }

  h1 {
    font-weight: 900;
    color: black;
    font-size: 3.5rem;
    margin-bottom: 0.2rem;
    letter-spacing: -0.1rem;
    @media (min-width: 320px) and (max-width: 480px) {
      /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */

      font-size: 2rem;
      margin-bottom: 0.2rem;
      letter-spacing: -0.1rem;
    }

    @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
      /* iPhone X */
      font-size: 2rem;
      margin-bottom: 0.2rem;
      letter-spacing: -0.05rem;
    }
  }
  p {
    font-size: 1rem;
    font-weight: 400;
    color: #333;
    letter-spacing: -0.02rem;
  }
`

const PageTitle = ({ children }) => (
  <PageTitleContainer>{children}</PageTitleContainer>
)

export default PageTitle
