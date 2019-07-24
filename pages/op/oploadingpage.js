import { FullPage } from '../../hocs/publicPage'
import Loading from '../../components/Loading'
import React from 'react'

export default class OpLoadingPage extends React.Component {
  render () {
    return (<FullPage><Loading><p>Loading details...</p></Loading></FullPage>)
  }
}
