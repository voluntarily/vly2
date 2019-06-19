import { Component } from 'react'
import reduxApi, { withOps } from '../../lib/redux/reduxApi.js'
import OpDetailForm from '../../components/Op/OpDetailForm'
import publicPage, { FullPage } from '../../hocs/publicPage'
import { message } from 'antd'
import Router from 'next/router'
import PropTypes from 'prop-types'

const newOp = {
  title: '',
  subtitle: '',
  imgUrl: '',
  duration: '',
  location: '',
  status: 'inactive'
}

export class OpUpdatePage extends Component {
  static async getInitialProps ({ store, query }) {
    // Get one Op
    if (query && query.id) {
      const ops = await store.dispatch(reduxApi.actions.opportunities.get(query))
      return { ops, query }
    } else {
      return {
        ops: [ { op: newOp } ],
        query
      }
    }
  }

  async componentDidMount () {
    try {
      await this.props.dispatch(reduxApi.actions.tags.get())
      console.log('got tags')
      console.log(this.props.tags.data)
    } catch (err) {
      console.log('error in getting tags', err)
    }
  }

  handleCancel = (op) => {
    Router.back()
  }

  async handleAdd (op) {
    if (!op) return

    op.tags = ['tagtagtag', 'tag2', 'tag5'] // remove once tags form linked up with op property
    const userTags = op.tags
    const dbTags = this.props.tags.data // tags existing in db
    const tagIds = [] // user-defined tags converted to their objectids
    const newTags = [] // user-defined tag values that aren't in the db

    // determine which tags need to be added to the database
    // based on whether they exist already or not.
    userTags.forEach(tag => {
      const match = dbTags.find((dbTag) => tag === dbTag.tag)
      if (match) {
        tagIds.push(match._id)
      } else {
        newTags.push({ tag: tag })
      }
    })

    // send post requests for each non-existing tag to create them
    await this.props.dispatch(reduxApi.actions.tags.post({}, { body: JSON.stringify(newTags) }))

    // find the ids of all the newly created tags, which are now in props
    newTags.forEach(newTag => {
      tagIds.push(this.props.tags.data.find(tag => tag.tag === newTag.tag)._id)
    })

    op.tags = tagIds

    // Actual data request
    let res = {}
    if (op._id) {
      res = await this.props.dispatch(reduxApi.actions.opportunities.put({ id: op._id }, { body: JSON.stringify(op) }))
    } else {
      res = await this.props.dispatch(reduxApi.actions.opportunities.post({}, { body: JSON.stringify(op) }))
    }
    op = res[0]
    message.success('Saved.')
    // go  to details page
    if (op && op._id) Router.push(`/ops/${op._id}`)
  }
  render () {
    const op = this.props.ops[0]
    const me = this.props.me
    return (
      <FullPage>
        <h1>Create a request</h1>
        <small>Ready to get some help? Lets start by letting volunteers know what you need</small>
        <OpDetailForm op={op} me={me} onSubmit={this.handleAdd.bind(this, op)} onCancel={this.handleCancel} />
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
    duration: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.oneOf(['active', 'inactive', 'hold'])
  }),
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  })
}

export default publicPage(withOps(OpUpdatePage))
