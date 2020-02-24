import { Component } from 'react'
import { Divider } from 'antd'
import { Helmet } from 'react-helmet'
import InterestArchivedSection from '../../components/Interest/InterestArchivedSection'
import OpDetailArchived from '../../components/Op/OpDetailArchived'
import { FullPage } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'
import reduxApi, { withArchivedOpportunities } from '../../lib/redux/reduxApi.js'
import Loading from '../../components/Loading'
import OpArchivedHeader from '../../components/Op/OpArchivedHeader'
import OpUnknown from '../../components/Op/OpUnknown'

export class ArchivedOpDetailPage extends Component {
  constructor (props) {
    super(props)
    this.retrieveOpportunity = this.retrieveOpportunity.bind(this)
  }

  static async getInitialProps ({ store, query }) {
    // If no id is supplied
    if (!(query && query.id)) {
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
      startDate: this.props.archivedOpportunities.data[0].date[0],
      endDate: this.props.archivedOpportunities.data[0].date[1]
    }
  }

  render () {
    // Verifying that we do not show the page unless data has been loaded when the opportunity is not new
    if (!this.props.isNew) {
      if (!this.props.archivedOpportunities.sync) {
        return (<Loading label='past activities' entity={this.props.archivedOpportunities} />)
      }
      if (this.props.archivedOpportunities.data.length !== 1) {
        return (<OpUnknown />)
      }
    }

    const op = this.retrieveOpportunity()
    return (
      <FullPage>
        <Helmet>
          <title>Voluntarily - Archived Opportunity Details</title>
        </Helmet>
        <OpArchivedHeader />
        <OpDetailArchived
          op={op}
          {...this.props}
        />
        <Divider />
        <InterestArchivedSection opid={op._id} />
      </FullPage>
    )
  }
}
export const ArchivedOpDetailPageWithArchivedOps = withArchivedOpportunities(ArchivedOpDetailPage)
export default publicPage(withArchivedOpportunities(ArchivedOpDetailPage))
