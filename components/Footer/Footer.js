import Link from 'next/link'
import { FormattedMessage } from 'react-intl';
import { Layout, Menu } from 'antd';

export default () => (
    <Layout.Footer>
      <nav>
        <Menu mode="horizontal" theme="dark" >
          <Menu.Item><Link href="/acts" ><a>Activities</a></Link></Menu.Item>
          <Menu.Item><Link href="/ops" ><a>Opportunities</a></Link></Menu.Item>
          <Menu.Item><Link href="/people" ><a>People</a></Link></Menu.Item>
          <Menu.Item><Link href="/orgs" ><a>Organisations</a></Link></Menu.Item>
          <Menu.Item><Link href="/kittens" ><a>Showcase</a></Link></Menu.Item>
        </Menu>
      </nav>
      <div className="footer" >
        <span>&copy; 2019 &middot; <a href="http://voluntari.ly">Voluntari.ly</a></span>
        <p>
          <FormattedMessage
            id="footerCredit"
            defaultMessage='Voluntari.ly is an initiative of the { pfctlink }&nbsp;Supported by: Datacom, Spark, ATEED'
            description="message in the footer giving credit to sponsors"
            values={{
              pfctlink: <a href="https://www.pamfergusson.org.nz/" className="external_link" target="_blank">Pam Fergusson Charitable Trust.</a>
            }}
          />
        </p>
      </div>
      <style jsx>{`
        .footer{
          padding: 3em;
          background-size: cover;
          background-color: #f4f4f4;
        }
        
        .footer span {
          font-size: 14px;
          color: #111;
        }
        
        .footer a{
          color: #111;
          text-decoration: none;
          font-weight: 700;
        }
      `}</style>
    </Layout.Footer>
)

