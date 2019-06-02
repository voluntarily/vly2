import { Component } from 'react'
import reduxApi, { withActs } from '../../lib/redux/reduxApi.js'
import { FormattedMessage } from 'react-intl'
import ActDetailForm from '../../components/Act/ActDetailForm'
import publicPage, { FullPage } from '../../hocs/publicPage'
import { message } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'

const newAct = {
  title: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  status: 'draft'
}

export class ActUpdatePage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Act
    if (query && query.id) {
      const acts = await store.dispatch(reduxApi.actions.activities.get(query))
      return { acts, query }
    } else {
      return {
        acts: [ { act: newAct } ],
        query
      }
    }
  }

  handleCancel = (act) => {
    Router.back()
  }

  async handleAdd (act) {
    if (!act) return
    // Actual data request
    let res = {}
    if (act._id) {
      res = await this.props.dispatch(reduxApi.actions.activities.put({ id: act._id }, { body: JSON.stringify(act) }))
    } else {
      res = await this.props.dispatch(reduxApi.actions.activities.post({}, { body: JSON.stringify(act) }))
    }
    act = res[0]
    message.success('Saved.')
    // go  to details page
    if (act && act._id) Router.push(`/acts/${act._id}`)
  }
  render () {
    const act = this.props.acts[0]
    const me = this.props.me
    return (
      <FullPage>
        <h1>
          <FormattedMessage
            id='act.update.newActivity'
            defaultMessage='Create an Activity'
            description='title on update activity page to create new activity'
          />
        </h1>
        <small>
          <FormattedMessage
            id='act.update.helptext'
            defaultMessage='Help people find this activity.'
            description='help text on activity update page'
          />
        </small>
        <ActDetailForm act={act} me={me} onSubmit={this.handleAdd.bind(this, act)} onCancel={this.handleCancel} />
        <br />
        {/* <Collapse>
          <Panel header="Debug" key="1">
            <pre>
              {JSON.stringify(this.props.act, null, 2)}
            </pre>
          </Panel>
        </Collapse> */}
      </FullPage>
    )
  }
}

ActUpdatePage.propTypes = {
  act: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default publicPage(withActs(ActUpdatePage))
