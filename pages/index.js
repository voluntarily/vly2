import Landing from './landing/landing'
import Home, { getServerSideProps as gssp } from './home/home'

export const getServerSideProps = gssp

const RootPage = (props) => {
  return (
    <>
      {props.isAuthenticated
        ? <Home {...props} />
        : <Landing {...props} />}
    </>)
}

// RootPage.getInitialProps = async (ctx) => {
//   const session = await getSession(ctx.req, ctx.store)
//   const page = session.isAuthenticated ? Home : Landing
//   if (page.getInitialProps) {
//     const pageProps = await page.getInitialProps(ctx)
//     return pageProps
//   }
// }

export default RootPage
