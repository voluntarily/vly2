import React, { Component } from 'react'

import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'

export class PageTemplate extends Component {
  render () {
    return <FullPage />
  }
}

export default publicPage(PageTemplate)
