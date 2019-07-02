import { Component } from 'react'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import OpDetailForm from '../../components/Op/OpDetailForm'
import { FullPage } from '../../hocs/publicPage'
import securePage from '../../hocs/securePage'
import { message, Divider } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'
import PageTitle from '../../components/LandingPageComponents/PageTitle.js'
const newOp = {
  title: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  location: '',
  status: 'inactive',
  date: [],
  startDate: null,
  endDate: null,
  tags: []
}

export class OpUpdatePage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Op
    const opExists = !!(query && query.id) // !! converts to a boolean value
    if (opExists) {
      await store.dispatch(reduxApi.actions.opportunities.get(query))
    }
    await store.dispatch(reduxApi.actions.locations.get())
    await store.dispatch(reduxApi.actions.tags.get())
    return { opExists }
  }

  handleCancel = op => {
    Router.back()
  }

  async handleAdd (op) {
    if (!op) return

    const userTags = op.tags
    const dbTags = this.props.tags.data // tags existing in db
    const tagIds = [] // user-defined tags converted to their objectids
    const newTags = [] // user-defined tag values that aren't in the db

    // determine which tags need to be added to the database
    // based on whether they exist already or not.
    userTags.forEach(tag => {
      const match = dbTags.find(dbTag => tag === dbTag.tag)
      if (match) {
        tagIds.push(match._id)
      } else {
        newTags.push({ tag: tag })
      }
    })

    // send post requests for each non-existing tag to create them
    await this.props.dispatch(
      reduxApi.actions.tags.post({}, { body: JSON.stringify(newTags) })
    )

    // find the ids of all the newly created tags, which are now in props
    newTags.forEach(newTag => {
      tagIds.push(this.props.tags.data.find(tag => tag.tag === newTag.tag)._id)
    })

    let updatedOp = {
      ...op,
      tags: tagIds
    }

    // Actual data request
    let res = {}
    if (updatedOp._id) {
      res = await this.props.dispatch(
        reduxApi.actions.opportunities.put(
          { id: updatedOp._id },
          { body: JSON.stringify(updatedOp) }
        )
      )
    } else {
      res = await this.props.dispatch(
        reduxApi.actions.opportunities.post(
          {},
          { body: JSON.stringify(updatedOp) }
        )
      )
    }
    updatedOp = res[0]
    message.success('Saved.')

    // go  to details page
    if (updatedOp && updatedOp._id) Router.push(`/ops/${updatedOp._id}`)
  }
  render () {
    const op = this.props.opExists ? {
      ...this.props.opportunities.data[0],
      tags: this.props.opportunities.data[0].tags.map(op => op.tag),
      startDate: this.props.opportunities.data[0].date[0],
      endDate: this.props.opportunities.data[0].date[1]
    } : newOp

    const me = this.props.me
    const existingTags = this.props.tags.data.map(tag => tag.tag)

    const existingLocations = [
      ...this.props.locations.data[0].regions.map(r => r.name),
      ...this.props.locations.data[0].territories
    ]

    return (
      <FullPage>
        <PageTitle
          title='Create a request'
          subtitle='Ask volunteers for assistance with anything related to tech - there are 1,312 volunteers looking for opportunities to help out'
        />
        <Divider />
        <OpDetailForm
          op={op}
          me={me}
          onSubmit={this.handleAdd.bind(this, op)}
          onCancel={this.handleCancel}
          existingTags={existingTags}
          existingLocations={existingLocations}
        />

        <br />
        {/* <Collapse>
          <Panel header="Debug" key="1">
            <pre>
              {JSON.stringify(this.props.op, null, 2)}
            </pre>
          </Panel>
        </Collapse> */}
      </FullPage>
    )
  }
}

OpUpdatePage.propTypes = {
  op: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    imgUrl: PropTypes.any,
    date: PropTypes.any,
    duration: PropTypes.string,
    location: PropTypes.string,
    tags: PropTypes.object,
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default securePage(withOps(OpUpdatePage))
