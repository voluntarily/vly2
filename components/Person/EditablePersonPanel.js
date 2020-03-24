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
  }, [])

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
        locations={locations.data[0].locations}
        onSubmit={handleUpdate}
        onCancel={doneEditing}
      />)
  }

  return (
    <>

      <PersonDetail person={person} panelEdit={() => setEditing(true)} />
      {/* <Button
        style={{ float: 'right' }}
        type='secondary'
        shape='round'
        onClick={() => setEditing(true)}
      >
        <FormattedMessage
          id='editPerson'
          defaultMessage='Edit'
          description='Button to edit an person on PersonDetails page'
        />
      </Button> */}
    </>
  )
}

export default EditablePersonPanel
