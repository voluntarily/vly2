import { Table } from 'antd'
import AliasDisplay from './AliasDisplay'
import EditableTagCell from './EditableTagCell'
import AddAlias from './AddAlias'
import { withTagManagement } from '../../lib/redux/reduxApi.js'
import { useSelector } from 'react-redux'
import ReduxLoading from '../Loading'

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
    key: 'action',
    render: (action) => (
      <a>Remove tag</a>)
  }
]

export const TagTable = (props) => {
  const [aliases] = useSelector(state => [state.aliases])
  const data = []

  if (!aliases || !aliases.sync) {
    return <ReduxLoading entity={aliases} label='aliases' />
  }
  if (props.searchVal) {
    aliases.data.filter(alias => alias.tag.toLowerCase().includes(props.searchVal.toLowerCase())).map((alias, index) => {
      data.push({
        key: index,
        tag: alias.tag,
        aliases: alias.aliases,
        action: 'x'
      })
    })
  } else {
    aliases.data.map((alias, index) => {
      data.push({
        key: index,
        tag: alias.tag,
        aliases: alias.aliases,
        action: 'x'
      })
    })
  }

  return <Table dataSource={data} columns={columns} />
}

export default withTagManagement(TagTable)
