import { Table } from 'antd'
import AliasDisplay from './AliasDisplay'
import EditableTagCell from './EditableTagCell'
import AddAlias from './AddAlias'

const dataSource = [
  {
    key: '1',
    tag: 'programming',
    aliases: ['development', 'coding'],
    action: 'x'
  },
  {
    key: '2',
    tag: 'development',
    aliases: ['programming', 'coding'],
    action: 'x'
  },
  {
    key: '3',
    tag: 'coding',
    aliases: ['programming', 'development'],
    action: 'x'
  }
]

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
  return <Table dataSource={dataSource} columns={columns} />
}
