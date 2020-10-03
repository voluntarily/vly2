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
  let data = [];
  props.aliases.map((alias, index) => {
    data.push({
    key: index,
    tag: alias.tag,
    aliases: alias.aliases,
    action: 'x'})
  })
  console.log("this is my data " + JSON.stringify(data))
  return <Table dataSource={data} columns={columns} />
}
