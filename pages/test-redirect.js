import React from 'react'
import Router from 'next/router'
import publicPage from '../hocs/publicPage'
import Loading from '../components/Loading'
class TestRedirect extends React.Component {
  // static async getInitialProps (ctx) {
  //   console.log('test redirect called in getInitialProps ')
  //   if (ctx && ctx.req) {
  //     console.log('server side redirect')
  //     ctx.res.writeHead(302, { Location: `/` })
  //     ctx.res.end()
  //   } else {
  //     console.log('client side redirect')
  //     Router.push(`/`)
  //   }
  // }
  wait (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve() }, ms)
    })
  }

  async componentDidMount (props) {
    console.log('test redirect called in componentDidMount ')
    console.log(props)
    await this.wait(5000)
    Router.push(`/`)
  }

  render = () => {
    return <Loading />
  }
}
export default publicPage(TestRedirect)
// export default TestRedirect
