import { OpDetailPage } from '../op/opdetailpage'
import OpLoadingPage from '../op/oploadingpage'
import OpUnavailablePage from '../op/opunavailablepage'
import publicPage, { FullPage } from '../../hocs/publicPage'
import OpDetail from '../../components/Op/OpDetail'
import OpOrganizerInfo from '../../components/Op/OpOrganizerInfo'
import InterestSection from '../../components/Interest/InterestSection' // TODO Introduce archived interest section
import { Divider } from 'antd'
import reduxApi, { withArchivedOpportunities } from '../../lib/redux/reduxApi.js'

export class ArchivedOpDetailPage extends OpDetailPage {
  constructor (props) {
    super(props)
    this.retrieveOpportunity = this.retrieveOpportunity.bind(this)
  }

  static async getInitialProps ({ store, query }) {
    // If no id is supplied
    if (!(query && query._id)) {
      return
    }
    // TODO: [VP-280] run get location and tag data requests in parallel
    await store.dispatch(reduxApi.actions.locations.get())
    await store.dispatch(reduxApi.actions.tags.get())
    await store.dispatch(reduxApi.actions.archivedOpportunities.get(query))
  }

  retrieveOpportunity () {
    return {
      ...this.props.archivedOpportunities.data[0],
      // tags: this.props.opportunities.data[0].tags.map(op => op.tag),
      startDate: this.props.archivedOpportunities.data[0].date[0],
      endDate: this.props.archivedOpportunities.data[0].date[1]
    }
  }

  render () {
    // Verifying that we do not show the page unless data has been loaded when the opportunity is not new
    if (!this.props.isNew) {
      if (this.props.archivedOpportunities.loading) {
        return (<OpLoadingPage />)
      }
      if (this.props.archivedOpportunities.data.length !== 1) {
        return (<OpUnavailablePage />)
      }
    }

    let op = this.retrieveOpportunity()
    return (
      <FullPage>
        <OpDetail
          op={op}
        />
        <OpOrganizerInfo
          organizer={op.requestor}
        />
        <Divider />
        <InterestSection opid={op._id} />
      </FullPage>
    )
  }
}
export const ArchivedOpDetailPageWithArchivedOps = withArchivedOpportunities(ArchivedOpDetailPage)
export default publicPage(withArchivedOpportunities(ArchivedOpDetailPage))
