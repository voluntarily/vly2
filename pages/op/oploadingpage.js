import { FullPage } from '../../hocs/publicPage'
import Loading from '../../components/Loading'
import React from 'react'
import { Helmet } from 'react-helmet'

export default class OpLoadingPage extends React.Component {
  render() {
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Opportunity Loading...</title>
        </Helmet>
        <Loading>
          <p>Loading details...</p>
        </Loading>
      </FullPage>)
  }
}
