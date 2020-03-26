import styled from 'styled-components'
import { Button } from 'antd'

const HeroContainer = styled.div`
  margin: 10rem 0;
  position: relative;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
    margin-top: 8rem;
    padding-bottom: 1rem;
  }

  @media screen and (min-width: 768px) and (max-width: 1025px) {
    margin-top: 2rem;
    padding-bottom: 2rem;
  }

  @media screen and (max-width: 768px) {
    margin: 5rem 0 4rem 0;
    height: auto;
  }
`

const TextHeroTitle = styled.h1`
  font-weight: 700;
  font-size: 4.5rem;
  color: #000000;
  letter-spacing: -3.05px;
  line-height: 96px;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }
  @media screen and (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: -2px;
    line-height: 1.5;
  }
`

const TextMiniTitle = styled.p`
  margin-top: 2rem;
  width: 12.8rem;
  color: #515151;
  font-size: 1.2rem;
  letter-spacing: -0.5px;

  font-weight: 400;
  margin-bottom: -0.5rem;
  border-radius: 12px;

  @media screen and (min-width: 1026px) and (max-width: 1281px) {
  }
  @media screen and (min-width: 768px) and (max-width: 1025px) {
  }
  @media screen and (max-width: 768px) {
    margin-top: 4rem;
    margin-bottom: 0.5rem;
  }
`

const ButtonContainer = styled.div`
  margin-top: 1rem;
  @media screen and (max-width: 768px) {
    margin-top: 0;
  }
  button {
    margin-top: 1rem;
  }
`

// @TODO: [SUP-58] add teacher signup logic here
const Hero2 = ({ subheader, title }) => (
  <HeroContainer>
    <TextMiniTitle>{subheader}</TextMiniTitle>
    <TextHeroTitle>{title}</TextHeroTitle>

    <ButtonContainer>
      <Button shape='round' size='large'>
        Learn More
      </Button>
      &nbsp;&nbsp;
      <Button shape='round' size='large'>
        Business Sign up
      </Button>
    </ButtonContainer>
  </HeroContainer>
)

export default Hero2
