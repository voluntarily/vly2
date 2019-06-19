import styled from 'styled-components'


const CardContainer = styled.div`

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
`


const ActionCard = ({ ...props }) => ( 

<CardContainer></CardContainer>



    )

    export default ActionCard