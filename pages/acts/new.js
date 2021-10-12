import reduxWrapper from '../../lib/redux/store'
import reduxApi from '../../lib/redux/reduxApi.js'
import { GroupTagList } from '../../server/api/tag/tag.constants'
import ActDetailPage from './[actId]'

export const getServerSideProps = reduxWrapper.getServerSideProps(
  store => async (props) => gssp({ store, query: props.query })
)

export const gssp = async ({ store, query }) => {
  // Get one Org
  console.log('acts/new GSSP', query)
  await store.dispatch(reduxApi.actions.tags.get({ name: GroupTagList }))
  return { props: { isNew: true } }
}

export default ActDetailPage
