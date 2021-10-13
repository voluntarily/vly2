import sinon from 'sinon'
import * as nextRouter from 'next/router'

const actionWithPromise = () => {
  // return new Promise((resolve, reject) => reject(Error('fail promise')))
  return new Promise((resolve, reject) => resolve('route changed'))
}

export const useMockRouter = (path, query = {}) => (t) => {
  t.context.router = {
    pathname: path,
    route: path,
    asPath: path,
    query: query,
    initialProps: {},
    pageLoader: sinon.fake(),
    App: sinon.fake(),
    Component: sinon.fake(),
    replace: sinon.fake(),
    push: sinon.fake(),
    back: sinon.fake(),
    prefetch: actionWithPromise
  }
  t.context.nextRouter = sinon.replace(nextRouter, 'useRouter', () => t.context.router)
}

export const unuseMockRouter = (t) => {
  // sinon.replace(nextRouter, 'useRouter', t.context.nextRouter)
  sinon.restore()
}
// test.afterEach.always(t => t.context.mockServer.reset())
export default useMockRouter
