
import Home from './home/home'
// import { getSession } from '../lib/auth/auth'

const RootPage = (props) => {
  return (
    <>
      <Home {...props} />
    </>)
}

RootPage.getInitialProps = async (ctx) => {
  // const session = await getSession(ctx.req, ctx.store)
  const page = Home
  if (page.getInitialProps) {
    const pageProps = await page.getInitialProps(ctx)
    return pageProps
  }
}

export default RootPage
