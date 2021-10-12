import reduxWrapper from '../../lib/redux/store'
import reduxApi from '../../lib/redux/reduxApi.js'
import PersonDetailPage from './[personId]'

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

export const gssp = async ({ store, query }) => {
  // Get one Org
  console.log('people/new GSSP', query)
  await store.dispatch(reduxApi.actions.locations.get({}))
  await store.dispatch(reduxApi.actions.tags.get({}))
  return { props: { isNew: true } }
}

export default PersonDetailPage
