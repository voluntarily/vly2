import { Table, Modal } from 'antd'
import AliasDisplay from './AliasDisplay'
import EditableTagCell from './EditableTagCell'
import AddAlias from './AddAlias'
import reduxApi, { withTagManagement } from '../../lib/redux/reduxApi.js'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import Loading from '../Loading'

const { confirm } = Modal

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
    render: aliases => (<span><AliasDisplay aliases={aliases[0]} tag={aliases[1]} /><AddAlias /></span>
    )
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action'
  }
]

// await Promise.all([
//   store.dispatch(reduxApi.actions.locations.get()),
//   store.dispatch(reduxApi.actions.tags.get())
// ])

export const TagTable = (props) => {
  const [aliases] = useState(props.aliases)
  const [deletedWords, addDeletedWord] = useState([])
  const dispatch = useDispatch()

  if (!aliases.sync) {
    return (<Loading label='aliases' entity={aliases} />)
  }

  useEffect(() => {
  }, [deletedWords])
  const confirmDelete = (e, tag) => {
    e.preventDefault()
    confirm({
      title: 'Do you want to delete these items?',
      content: (
        <div>Would you like to delete tag <b>{tag}</b> and all of its aliases?</div>
      ),
      onOk () {
        deleteTag(tag)
      },
      onCancel () { console.log('Canceled deletion of ' + tag) }
    })
  }

  const deleteTag = async (tag) => {
    try {
      await dispatch(reduxApi.actions.tagManagement.delete({ id: tag }))
      addDeletedWord(oldArray => [...oldArray, tag])
    } catch {
      console.error('YEAH NAH for deleting')
    }
  }

  if (props.searchVal) {
    return (
      <Table
        dataSource={aliases.data.filter(alias => (alias.tag.toLowerCase().includes(props.searchVal.toLowerCase())) && deletedWords.indexOf(alias.tag) === -1).map((alias, index) => {
          return {
            key: index,
            tag: alias.tag,
            aliases: [alias.aliases, alias.tag],
            action: <a onClick={(e) => confirmDelete(e, alias.tag)}>Remove tag</a>
          }
        })} columns={columns}
      />)
  }

  return (
    <Table
      dataSource={aliases.data.filter(alias => deletedWords.indexOf(alias.tag) === -1).map((alias, index) => {
        return {
          key: index,
          tag: alias.tag,
          aliases: [alias.aliases, alias.tag],
          action: <a onClick={(e) => confirmDelete(e, alias.tag)}>Remove tag</a>
        }
      })} columns={columns}
    />)
}

export default withTagManagement(TagTable)
