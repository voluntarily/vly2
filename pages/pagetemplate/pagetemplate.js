import React, { Component } from 'react'

import publicPage, { FullPage, Grid } from '../../hocs/publicPage'






export class PageTemplate extends Component {
    render () {
      return (
        <FullPage>

        </FullPage>
      )
    }
}

export default publicPage(PageTemplate)