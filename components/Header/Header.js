import Link from 'next/link'
import { FormattedMessage } from 'react-intl';
import { Layout } from 'antd';

import Navigation from './Navigation';
import navItems from './navigation.json';

// eslint-disable-next-line no-unused-vars
export default () => (
    <Layout.Header className="header">
      <img src="/static/vlogo.svg" />
      <h1 className="site-title" >
        <Link href="/" >
          <a><FormattedMessage
            id="siteTitle"
            defaultMessage="Voluntari.ly"
            description="Name of the Application on the menu bar"
          /></a>
        </Link>
      </h1>
      {/* <SearchBar /> */}
      <Navigation items={navItems.public} />
      <style jsx>{`

        .site-title {
          font-weight: 300;
          font-size: 2em;
          float: left;
        }
        
        .site-title a {
          text-decoration: none;
          color: white;
        }
        
        img {
          float: left;
          margin: 0.5rem;
        }
      
      `}</style>
    </Layout.Header>
)
