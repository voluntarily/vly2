import styled from 'styled-components'

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 40fr 60fr;

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    grid-template-columns: calc(100vw - 2rem);
  }
`

export const DescriptionContainer = styled.div`
  margin-right: 2rem;

  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    margin: initial;
  }
` // end descriptionContainer

export const TitleContainer = styled.div`
  margin-bottom: 0.5rem;
` // end titleContainer

export const InputContainer = styled.div`
  height: auto;
  margin-left: 2rem;
  margin-bottom: 2rem;
  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    margin: 1rem 0 0 0;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */
    margin: 1rem 0 0 0;
  }
` // end inputContainer

export const ShortInputContainer = styled.div`
  width: 25rem;
  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    width: auto;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */
    width: auto;
  }
`
export const MediumInputContainer = styled.div`
  width: 35rem;
  @media only screen and (min-width: 375px) and (max-width: 812px) and (-webkit-device-pixel-ratio: 3) {
    /* iPhone X */
    width: auto;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    /* #Device = Tablets, Ipads (portrait) #Screen = B/w 768px to 1024px */
    width: 25rem;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    /*  ##Device = Most of the Smartphones Mobiles (Portrait) ##Screen = B/w 320px to 479px */
    width: auto;
  }
`
// export default {
//   DescriptionContainer,
//   FormGrid,
//   InputContainer,
//   MediumInputContainer,
//   ShortInputContainer,
//   TitleContainer
// }
