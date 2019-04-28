import { FormattedMessage } from 'react-intl'
import { Layout } from 'antd'
import Navigation from '../Header/Navigation'
import navItems from './navigation_footer.json'

export default () =>
  <Layout.Footer>
    <Navigation items={navItems.admin} />
    <div className='footer' >
      <span>&copy; 2019 &middot; <a href='http://voluntari.ly'>Voluntari.ly</a></span>
      <p>
        <FormattedMessage
          id='footerCredit'
          defaultMessage='Voluntari.ly is an initiative of the { pfctlink }&nbsp;Supported by: Datacom, Spark, ATEED'
          description='message in the footer giving credit to sponsors'
          values={{
            pfctlink: <a href='https://www.pamfergusson.org.nz/' className='external_link' target='_blank'>Pam Fergusson Charitable Trust.</a>
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
