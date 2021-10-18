import styled from 'styled-components'
import Html from '../VTheme/Html'
import { useState } from 'react'

// DO NOT USE ATM - it breaks the site

const ShieldSiteLogo = styled.img`
  width: 2.5rem;
  cursor: 'pointer;

  @media screen and (min-width: 768px) and (max-width: 1280px) {
    margin-left: 2rem;
  }

  @media screen and (max-width: 767px) {
    margin-left: 1rem;
  }
`

const closeIcon = 'https://staticcdn.co.nz/embed/close.png'
const ifr = "<iframe sandbox='allow-forms allow-scripts allow-same-origin allow-popups' src='https://staticcdn.co.nz' width='310' height='420' style='opacity: .98; width:310px; height:420px;' frameBorder='0' />"

export const WomensRefuge = () => {
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState('')
  const open = () => {
    setContent(ifr)
    setVisible(true)
  }
  const close = () => {
    setVisible(false)
  }
  return (
    <>
      {visible &&
        <div>
          <Html>
            {content}
          </Html>
          <a href='#' id='wfclose' onClick={close}>
            <img src={closeIcon} alt='close modal' />
          </a>
        </div>}
      {!visible &&
        <ShieldSiteLogo
          alt='shielded'
          id='shielded-logo'
          height='60' width='60'
          src='https://shielded.co.nz/img/custom-logo.png'
          onClick={open}
        />}
    </>
  )
}

export default WomensRefuge
