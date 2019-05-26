import React, { Component } from 'react'

import publicPage, { FullPage } from '../../hocs/publicPage'

export class PageTemplate extends Component {
  render () {
    return <FullPage />
  }
}

export default publicPage(PageTemplate)
