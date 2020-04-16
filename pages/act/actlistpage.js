// [@TODO] - remove Input once actual search component is done
import { Helmet } from 'react-helmet'
import { FormattedMessage, defineMessages } from 'react-intl'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
import { FullPage, PageBannerNoTabs, PageBannerButtons } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import ActAdd from '../../components/Act/ActAdd'
import ActListSection from '../../components/Act/ActListSection'
import { useRouter } from 'next/router'

const { ASK, OFFER } = OpportunityType

const ActListTitleMessages = defineMessages({
  [ASK]: {
    id: 'ActListPage.Ask.Title',
    defaultMessage: 'Job list',
    description: 'Title of ask for help page'
  },
  [OFFER]: {
    id: 'ActListPage.Offer.Title',
    defaultMessage: 'Job List',
    description: 'Title of the offerings page'
  }
})

const ActListSubTitleMessages = defineMessages({
  [ASK]: {
    id: 'act.list.ask.subtitle',
    defaultMessage: 'Search for jobs and filter your results',
    description: 'Sub Title of page listing activities people are asking help with'
  },
  [OFFER]: {
    id: 'act.list.offer.subtitle',
    defaultMessage: 'Search for jobs and filter your results',
    description: 'Sub Title of page listing offerings people have'
  }
})

export const ActListPage = () => {
  const router = useRouter()
  const type = router.query.type

  return (
    <FullPage>
      <Helmet>
        <title>Vocationally</title>
      </Helmet>
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

export default publicPage(ActListPage)
