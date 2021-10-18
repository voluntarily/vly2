import Head from 'next/head'
import { FormattedMessage } from 'react-intl'

import OpList from '../../components/Op/OpList'
import OpAdd from '../../components/Op/OpAdd'
import { FullPage, PageBanner, PageBannerButtons } from '../../components/VTheme/VTheme'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import reduxWrapper from '../../lib/redux/store'

/*
  This is a basic crud listings page with no filters or anything
  as such its not really used in Voluntarily except as an admin check.
*/
export const OpListPage = ({ opportunities, roles }) =>
  <FullPage>
    <Head>
      <title>Opportunities - Voluntarily</title>
    </Head>
    <PageBanner>
      <h1>
        <FormattedMessage
          id='oplistpage.title'
          defaultMessage='All Opportunities'
          description='Title on full opportunities list'
        />
      </h1>
      <PageBannerButtons>
        <OpAdd roles={roles} />
      </PageBannerButtons>
      {/* <FormattedMessage
        defaultMessage='All current opportunities'
        id='oplistpage.subtitle'
      /> */}
    </PageBanner>
    <OpList ops={opportunities.data} />
  </FullPage>

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

export const gssp = async ({ store }) => {
  const select = {} // { s: 'name', p: 'name imgUrl placeOfWork job' }
  await store.dispatch(reduxApi.actions.opportunities.get(select))
}

export default withOps(OpListPage)
