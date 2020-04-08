
import { Icon } from 'antd'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { SideBarGrid } from '../VTheme/VTheme'
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
  // width: 30rem;
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
  i {
    font-size: 4rem;
    align-self: center;
    color: ${props => props.on ? 'green' : 'red'};
  }
`

const ToggleTick = ({ on }) => {
  return on
    ? (
      <Icon type='check-circle' />
    )
    : (
      <Icon type='close-circle' />
    )
}

const ToggleLi = ({ checked, children, onChange }) => {
  const [on, setOn] = useState(checked || false)
  const toggle = () => { onChange(!on); setOn(!on) }
  return (
    <ButtonLi onClick={toggle} on={on}>
      <ToggleTick on={on} />
      {children}
    </ButtonLi>
  )
}

/**
 * This page asks the person to select whether they are an asker or offerer
 */
export const ChooseParticipation = ({ children, roleAsk, onChangeAsk, roleOffer, onChangeOffer }) =>
  <SideBarGrid style={{ paddingTop: 0 }}>
    <div id='leftCol'>
      <img style={{ width: '100%' }} src='/static/img/sign-up/welcome-to-voluntarily.png' />
    </div>
    <div id='rightCol'>
      <p>
        <FormattedMessage
          id='ChooseParticipation.intro'
          defaultMessage='How do you want to use Voluntarily?'
        />
      </p>
      <ButtonUl id='role_options'>
        <ToggleLi key='role_ask' checked={roleAsk} onChange={onChangeAsk}>
          <div>
            <h2>
              <FormattedMessage
                id='ChooseParticipation.title.ask'
                defaultMessage='Ask for help from volunteers'
              />
            </h2>
            <p>
              <FormattedMessage
                id='WelcomeToVoluntarily.bodyAsk'
                defaultMessage='Need volunteers to help you out with an Activity. See what is available and ask for help.'
              />
            </p>
          </div>

        </ToggleLi>
        <ToggleLi key='role_offer' checked={roleOffer} onChange={onChangeOffer}>
          <div>
            <h2>
              <FormattedMessage
                id='ChooseParticipation.title.offer'
                defaultMessage='Offer to help people'
              />
            </h2>
            <p>
              <FormattedMessage
                id='WelcomeToVoluntarily.bodyOffer'
                defaultMessage='Want to volunteer your time, or resources to help out someone in need? See what is needed and offer your skills.'
              />
            </p>
          </div>
        </ToggleLi>
      </ButtonUl>
      {children}
    </div>

  </SideBarGrid>
export default ChooseParticipation
