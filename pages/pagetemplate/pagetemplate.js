import React, { Component } from 'react'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'

export class PageTemplate extends Component {
  render () {
    return <FullPage />
  }
}

export default publicPage(PageTemplate)
