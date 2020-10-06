import { Table, Modal } from 'antd'
import AliasDisplay from './AliasDisplay'
import EditableTagCell from './EditableTagCell'
import AddAlias from './AddAlias'
import reduxApi, { withTagManagement } from '../../lib/redux/reduxApi.js'
import { useSelector, useDispatch } from 'react-redux'
import ReduxLoading from '../Loading'

const { confirm } = Modal; 

const columns = [
  {
    title: 'Tag',
    dataIndex: 'tag',
    key: 'tag',
    render: tag => (<EditableTagCell tag={tag} />)
  },
  {
    title: 'Aliases',
    dataIndex: 'aliases',
    key: 'aliases',
    render: aliases => (<span><AliasDisplay tags={aliases} /><AddAlias /></span>
    )
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action'
  }
]

export const TagTable = (props) => {
  const [aliases, tags] = useSelector(state => [state.aliases, state.tagManagement])
  const data = []
  const dispatch = useDispatch()

  const removeTag = (tag) => {
    console.log("Removing " + tag)
  }

  const confirmDelete = (tag) => {
    confirm({
      title: 'Do you want to delete these items?',
      content:  (
        <div>
          Would you like to delete tag <b>{tag}</b> and all of its aliases?
        </div>
      ),
      onOk() { return dispatch(reduxApi.actions.tagManagement.delete({id: "3d"}))
      },
      onCancel() {console.log("Canceled deletion of " + tag)},
    });
  }
  if (!aliases || !aliases.sync) {
    return <ReduxLoading entity={aliases} label='aliases' />
  }
  if (props.searchVal) {
    aliases.data.filter(alias => alias.tag.toLowerCase().includes(props.searchVal.toLowerCase())).map((alias, index) => {
      data.push({
        key: index,
        tag: alias.tag,
        aliases: alias.aliases,
        action: <a onClick={(e) => confirmDelete(alias.tag)}>Remove tag</a>
      })
    })
  } else {
    aliases.data.map((alias, index) => {
      data.push({
        key: index,
        tag: alias.tag,
        aliases: alias.aliases,
        action: <a onClick={(e) => confirmDelete(alias.tag)}>Remove tag</a>
      })
    })
  }

  return <Table dataSource={data} columns={columns} />
}

export default withTagManagement(TagTable)
