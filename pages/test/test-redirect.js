import React from 'react'
import Router from 'next/router'
import publicPage from '../../hocs/publicPage'
import Loading from '../../components/Loading'
class TestRedirect extends React.Component {
  wait (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve() }, ms)
    })
  }

  async componentDidMount (props) {
    await this.wait(5000)
    Router.push('/')
  }

  render = () => {
    return <Loading />
  }
}
export default publicPage(TestRedirect)
// export default TestRedirect
