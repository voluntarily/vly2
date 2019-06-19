import styled from 'styled-components'

const CardContainer = styled.a`
  width: 18.5rem;
  height: 23rem;
  border-radius: 0.5rem;
  box-shadow: 2px 2px 24px 0 rgba(118, 118, 118, 0.5);
  background-color: #fff;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;

  :hover {
    box-shadow: 8px 8px 32px 0 rgba(118, 118, 118, 0.8);
    transform: scale(1.02);
  }
 
` //end card container

const CardImage = styled.img`` // end ActionCardImage

const CardTitle = styled.h1`
margin: 2rem 1rem 0.5rem 1rem;
  font-size: 20px;
  font-weight: 700;
  color: #6549AA;
  letter-spacing: -0.38px;
  line-height: 24px;
` // end ActionCardTitle

const CardDescription = styled.p`
font-size: 16px;
color: #000000;
letter-spacing: -0.3px;
margin: 0 1rem 1rem 1rem;
` // ActionCardDescription

const ActionCard = ({ image, title, description, link, ...props }) => (


    <CardContainer href={link} target="_blank">
       <CardImage src={image} />
       <CardTitle>{title}</CardTitle>
       <CardDescription>{description}</CardDescription> 
    </CardContainer>

)
export default ActionCard
