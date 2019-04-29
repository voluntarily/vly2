import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import securePage from '../hocs/securePage'

const Content = styled.p`
  font-size: 20px;
  font-weight: 200;
  line-height: 30px;
`

const Secret = ({ loggedUser }) => (
  <div>
    <Content>
      Hi <strong>{loggedUser.email}</strong>. Try loading this page again using the incognito/private mode of your browser.
    </Content>
  </div>
)

Secret.propTypes = {
  loggedUser: PropTypes.object.isRequired
}

export default securePage(Secret)
