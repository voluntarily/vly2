import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import securePage from '../hocs/securePage'
import { A4 } from '../hocs/publicPage'

const Content = styled.p`
  font-size: 20px;
  font-weight: 200;
  line-height: 30px;
`

const Secret = ({ me }) => (
  <A4>
    <Content>
      Hi <strong>{me.email}</strong>. Try loading this page again using the incognito/private mode of your browser.
    </Content>
  </A4>
)

Secret.propTypes = {
  loggedUser: PropTypes.object.isRequired
}

export default securePage(Secret)
