
import { Icon } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
export const ToggleUl = styled.ul`
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
  grid-template-columns: 4rem 1fr 4rem;
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

export const ToggleTick = ({ on }) => {
  return on &&
    (
      <Icon type='check-circle' />
    )
    // : (
    //   <Icon type='close-circle' />
    // )
}

export const ToggleLi = ({ checked, icon, children, onChange }) => {
  const [on, setOn] = useState(checked || false)
  const toggle = () => { onChange(!on); setOn(!on) }
  return (
    <ButtonLi onClick={toggle} on={on}>
      <img style={{ width: '100%' }} src={`/static/img/sign-up/${icon}.svg`} />
      {children}
      <ToggleTick on={on} />
    </ButtonLi>
  )
}
