import reduxWrapper from '../../../lib/redux/store'
import reduxApi from '../../../lib/redux/reduxApi.js'
import OpDetailPage from '../[opId]'

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

export const gssp = async ({ store, query }) => {
  // console('getInitialProps: OpDetailPage', store, query)
  console.log('op/new GSSP', query)

  // Get one Org
  // const isNew = !!(query && query.new && [OpportunityType.ASK, OpportunityType.OFFER].includes(query.new))
  await Promise.all([
    store.dispatch(reduxApi.actions.locations.get({})),
    store.dispatch(reduxApi.actions.tags.get({}))
  ])

  // get my org membership so we can attach the op to an organisation.
  const me = store.getState().session.me
  if (me._id) {
    await store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() }))
  }
  const res = {
    props: {
      isNew: true,
      opType: query.type
    }
  }
  // if there is an act parameter then get the activity and create initial op.
  if (query.act) {
    await store.dispatch(reduxApi.actions.activities.get({ id: query.act }))
    res.props.actid = query.act
  }

  return res
}

export default OpDetailPage
