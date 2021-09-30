import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import Loading from '../../components/Loading'
import PersonDetail from '../../components/Person/PersonDetail'
import { FullPage } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import reduxApi, { withPeople, withLocations } from '../../lib/redux/reduxApi.js'

export class TestPerson extends Component {
  static async getInitialProps ({ store, query, req }) {
    if (query && query.id) {
      try {
        await Promise.all([
          store.dispatch(reduxApi.actions.people.get(query)),
          store.dispatch(reduxApi.actions.locations.get()),
          store.dispatch(reduxApi.actions.tags.get())
        ])
      } catch (err) {
        // this can return a 403 forbidden if not signed in
        console.error('Error in testperson:', err)
      }

      return {
        isNew: false,
        personid: query.id
      }
    }
  }

  render () {
    let content = ''
    let person = null
    if (!this.props.people.sync) {
      content = <Loading label='person' entity={this.props.people} />
    } else {
      const people = this.props.people.data
      if (people.length === 1) {
        person = people[0]
      // } else {
      //   person = this.props.me
      }
    }

    if (this.props.people.sync) {
      if (!person) {
        content =
          <>
            <h2><FormattedMessage id='test-person.notavailable' defaultMessage='Sorry, this person is not available' description='message on person not found page' /></h2>
          </>
      } else {
        content =
          <>
            <PersonDetail person={person} />
            <pre>{JSON.stringify(this.props.locations)}</pre>
          </>
      }
    }
    return (
      <FullPage>
        <Helmet>
          <title>Test Person - Voluntarily</title>
        </Helmet>
        {content}
      </FullPage>
    )
  }
}

export default securePage(withPeople(withLocations(TestPerson)))
