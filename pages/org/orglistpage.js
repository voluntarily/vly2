import { Button } from 'antd'
import Link from 'next/link'
import Head from 'next/head'
import { FormattedMessage } from 'react-intl'
import OrgList from '../../components/Org/OrgList'
import { FullPage, PageBannerButtons, PageBannerNoTabs } from '../../components/VTheme/VTheme'

import reduxApi, { withOrgs } from '../../lib/redux/reduxApi.js'
import reduxWrapper from '../../lib/redux/store'

export const OrgListPage = ({ organisations, me }) => {
  const orgs = organisations.data
  const isAdmin = (me && me.role.includes('admin'))
  return (
    <FullPage>
      <Head>
        <title>Organisations - Voluntarily</title>
      </Head>
      <PageBannerNoTabs>
        <h1>
          <FormattedMessage
            defaultMessage='Organisations'
            id='org.list.heading'
          />
        </h1>
        <PageBannerButtons>
          {isAdmin &&
            <Button type='primary' size='large' shape='round'>
              <Link href='/org/new'>
                <a>
                  <FormattedMessage id='org.new' defaultMessage='New Organisation' description='Button to create a new organisation' />
                </a>
              </Link>
            </Button>}
        </PageBannerButtons>
        <FormattedMessage
          defaultMessage='Check out organisations doing social good on the Voluntarily platform'
          id='org.list.subtitle'
        />
      </PageBannerNoTabs>
      <OrgList orgs={orgs} />
    </FullPage>)
}

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async () => {
    const select = { p: 'name imgUrl role' }
    await store.dispatch(reduxApi.actions.organisations.get(select))
  })

export default withOrgs(OrgListPage)
