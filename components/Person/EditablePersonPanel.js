import { message } from 'antd'
import React, { useState, useEffect } from 'react'
import PersonDetail from '../../components/Person/PersonDetail'
import PersonDetailForm from '../../components/Person/PersonDetailForm'
import reduxApi from '../../lib/redux/reduxApi.js'
import { useDispatch, useSelector } from 'react-redux'

export const EditablePersonPanel = ({ person, me }) => {
  const [editing, setEditing] = useState(false)
  const dispatch = useDispatch()
  const [tags, locations] = useSelector(
    state => [state.tags, state.locations]
  )
  useEffect(() => {
    const getEditorOptions = async () => {
      await Promise.all([
        dispatch(reduxApi.actions.tags.get()),
        dispatch(reduxApi.actions.locations.get({ withRelationships: true }))
      ])
    }
    getEditorOptions()
  }, [dispatch])

  const doneEditing = () => {
    window.scrollTo(0, 0)
    setEditing(false)
  }
  const handleUpdate = async (person) => {
    await dispatch(
      reduxApi.actions.people.put(
        { id: person._id },
        { body: JSON.stringify(person) }
      )
    )
    message.success('Saved.')
    doneEditing()
  }

  if (editing) {
    return (
      <PersonDetailForm
        person={person}
        existingTags={tags.data}
        locations={locations.data[0]}
        onSubmit={handleUpdate}
        onCancel={doneEditing}
      />
    )
  }

  return (
    <PersonDetail person={person} canEdit panelEdit={() => setEditing(true)} />
  )
}

export default EditablePersonPanel
