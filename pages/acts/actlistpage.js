// [@TODO] - remove Input once actual search component is done
import Head from 'next/head'
import { FormattedMessage, defineMessages } from 'react-intl'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { FullPage, PageBannerNoTabs, PageBannerButtons } from '../../components/VTheme/VTheme'

import ActAdd from '../../components/Act/ActAdd'
import ActListSection from '../../components/Act/ActListSection'
import { useRouter } from 'next/router'

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

export const ActListPage = () => {
  const router = useRouter()
  const type = router.query.actType || 'ask'

  return (
    <FullPage>
      <Head>
        <title>Activities - Voluntarily</title>
      </Head>
      <PageBannerNoTabs>
        <h1>
          <FormattedMessage {...ActListTitleMessages[type]} />
        </h1>
        <PageBannerButtons>
          <ActAdd />
        </PageBannerButtons>
        <FormattedMessage {...ActListSubTitleMessages[type]} />
      </PageBannerNoTabs>
      <ActListSection />
    </FullPage>
  )
}

export default ActListPage
