import Head from 'next/head'
import { Layout } from 'antd'
import Footer from './Footer/Footer'
import Header from './Header/Header'
import ReactGA from 'react-ga';
ReactGA.initialize('UA-141212194-1'); // Here we should use our GA id
export default ({ children, title = 'Voluntari.ly', className }) => (
  <Layout>
    <Head>
      <title>{title}</title>
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />


    </Head>
    <Header />
    <Layout.Content >
      <div className={className} >
        {children}
      </div>
      <style jsx>{`

        .a4 {
          margin: 3em;
          padding-bottom: 4em;
          max-width: 50em;
        }
        @media (max-width: 600px) {
          .a4 {
            margin: 0 3em;
          }
        }

        .fullpage {
          margin: 3em;
          padding-bottom: 4em;
        }
        @media (max-width: 600px) {
          .fullpage {
            margin: 0 3em;
          }
        }

      `}</style>
    </Layout.Content>

    <Footer />
  </Layout>
)
