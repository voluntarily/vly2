import reduxWrapper from '../../lib/redux/store'
import reduxApi from '../../lib/redux/reduxApi.js'
import OrgDetailPage from './[orgId]'

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

export const gssp = async ({ store, query }) => {
  const isAuthenticated = store.getState().session.isAuthenticated
  const me = store.getState().session.me

  await Promise.all([
    isAuthenticated ? store.dispatch(reduxApi.actions.members.get({ meid: me._id.toString() })) : Promise.resolve(),
    store.dispatch(reduxApi.actions.tags.get({}))
  ])
  return { props: { isNew: true } }
}

export default OrgDetailPage
