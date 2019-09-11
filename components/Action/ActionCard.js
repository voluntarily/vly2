import styled from 'styled-components'

const CardContainer = styled.a`
  width: 18.5rem;
  height: 23rem;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 24px 0 rgba(118, 118, 118, 0.5);
  background-color: #fff;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

overflow: hidden;

  :hover {
    box-shadow: 8px 8px 32px 0 rgba(118, 118, 118, 0.8);
    transform: scale(1.02);
  }
 


  @media screen and (max-width: 768px) {

          width: calc(100vw - 2rem);
          margin-bottom: 1rem;
          height: auto;

  }


` // end card container

const CardImage = styled.img`
width: 100%;

` // end ActionCardImage

const CardTitle = styled.h1`
margin: 2rem 1rem 0.5rem 1rem;
  font-size: 20px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.38px;
  line-height: 24px;
    @media screen and (max-width: 768px) {
      margin: 0rem 1rem 0.5rem 1rem;
  }
` // end ActionCardTitle

const CardDescription = styled.p`
font-size: 16px;
color: #000000;
letter-spacing: -0.3px;
margin: 0 1rem 1rem 1rem;
` // ActionCardDescription

const ActionCard = ({ image, name, description, link, ...props }) => (

  <CardContainer href={link} target='_blank'>
    <CardImage src={image} />
    <CardTitle>{name}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardContainer>

)
export default ActionCard
