import Link from 'next/link'
import Head from 'next/head'
import { Layout } from 'antd';
import Footer from './Footer/Footer';
import Header from './Header/Header';

export default ({ children, title = 'Voluntari.ly', className }) => (
  <Layout>
    <Head>
      <title>{title}</title>
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    <Header />
    <Layout.Content className={className} >
      {children}
    </Layout.Content>
    
    <Footer />
  </Layout>
)