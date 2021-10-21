import Head from 'next/head'
import { FormattedMessage, defineMessages } from 'react-intl'

import { OpportunityType } from '../../../server/api/opportunity/opportunity.constants'
import { FullPage, PageBannerNoTabs, PageBannerButtons } from '../../../components/VTheme/VTheme'
import ActAdd from '../../../components/Act/ActAdd'
import ActListSection from '../../../components/Act/ActListSection'

const { ASK, OFFER } = OpportunityType

const ActListTitleMessages = defineMessages({
  [ASK]: {
    id: 'ActListPage.Ask.Title',
    defaultMessage: 'Volunteers are offering to help with',
    description: 'Title of ask for help page'
  },
  [OFFER]: {
    id: 'ActListPage.Offer.Title',
    defaultMessage: 'People are asking for help with',
    description: 'Title of the offerings page'
  }
})

const ActListSubTitleMessages = defineMessages({
  [ASK]: {
    id: 'act.list.ask.subtitle',
    defaultMessage: 'Find activities volunteers are offering to help you with',
    description: 'Sub Title of page listing activities people are asking help with'
  },
  [OFFER]: {
    id: 'act.list.offer.subtitle',
    defaultMessage: 'Find activities you can offer to help with',
    description: 'Sub Title of page listing offerings people have'
  }
})

export const ActListPage = ({ actType }) => {
  return (
    <FullPage>
      <Head>
        <title>{actType} Activities - Voluntarily</title>
      </Head>
      <PageBannerNoTabs>
        <h1>
          <FormattedMessage {...ActListTitleMessages[actType]} />
        </h1>
        <PageBannerButtons>
          <ActAdd />
        </PageBannerButtons>
        <FormattedMessage {...ActListSubTitleMessages[actType]} />
      </PageBannerNoTabs>
      <ActListSection />
    </FullPage>
  )
}

/** GSSP seems to be required for dynamic pages.
 * removing this causes a deep exception in react-intl in the render.
 * but it gives us the opportunity of checking the query.
 */
export const getServerSideProps = async ({ query }) => {
  return { props: { actType: query.actType || 'ask' } }
}

export default ActListPage
