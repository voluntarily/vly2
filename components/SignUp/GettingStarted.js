
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

export const ButtonUl = styled.ul`
  margin: 1.5rem 0 1rem 0;
  padding-left: 0;
  list-style: none;
`

export const ButtonLi = styled.li`
    transition: all 0.3s;
    list-style: none;
    padding: 1rem;
    margin: 0 0 1.5rem 0;
    box-shadow: 2px 2px 12px 0 rgba(190, 190, 190, 0.5);
    border-radius: 8px;
    display: grid;
    grid-template-columns: 4rem 1fr;
    gap: 1rem;  
    width: 40rem;

    img {
      height: 4rem;
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

/**
 * This page asks the person to select whether they are an asker or offerer
 */
export const GettingStarted = () =>
  <ButtonUl id='role_options'>
    <ButtonLi key='role_ask'>
      <img style={{ height: '3rem' }} src='/static/img/sign-up/smiley.svg' alt='an image showing someone asking for help' />
      <div>
        <h2>
          <FormattedMessage
            id='GettingStarted.title.ask'
            defaultMessage='Ask for help from volunteers'
          />
        </h2>
        <p>
          <FormattedMessage
            id='GettingStarted.body.ask'
            defaultMessage='Get help from volunteers who want to do their part'
          />
        </p>
      </div>
    </ButtonLi>
    <ButtonLi key='role_offer'>
      <img style={{ height: '3rem' }} src='/static/img/sign-up/smiley.svg' alt='an image showing someone offering help' />
      <div>
        <h2>
          <FormattedMessage
            id='GettingStarted.title.offer'
            defaultMessage='Offer to help people'
          />
        </h2>
        <p>
          <FormattedMessage
            id='GettingStarted.body.offer'
            defaultMessage='Offer your skills and time to your community'
          />
        </p>
      </div>
    </ButtonLi>
  </ButtonUl>

export default GettingStarted
