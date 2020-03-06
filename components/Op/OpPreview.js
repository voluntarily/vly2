import { Card } from '../VTheme/VTheme'
import styled from 'styled-components'
import { ItemDuration, ItemDate, ItemLocation } from '../VTheme/ItemList'

const PreviewContainer = styled.article`

display: grid;

margin-bottom: 1rem;
grid-template-columns: 2fr 4fr;
overflow: hidden;
border-radius: 8px;
box-shadow: 1px 1px 24px 0 rgba(0,0,0,0.2);

transition: all 0.3s;

max-height: 14rem;

  div {
    align-self: center;
    padding: 1.5rem;
  }

  p {
      margin-bottom: 0;
  }

  img {
    height: 100%;
      object-fit: cover;
   
  }

  :hover {
      box-shadow: 2px 2px 24px 0 rgba(0,0,0,0.5);
    p>strong {
      color: #653CAD;
    }
  } 

  :focus {

    box-shadow: 2px 2px 24px 0 rgba(0,0,0,0.5);
    p>strong {
      color: #653CAD;
    }
  }

`
const OpPreview = () => (
  <PreviewContainer>
    <img src='https://picsum.photos/200/300' />
    <div>
      <h4><strong>Legitimate technology bootcamp</strong></h4>
      <ItemDuration />
      <ItemDate />
      <ItemLocation />

    </div>

  </PreviewContainer>
)

export default OpPreview
