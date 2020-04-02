// Demonstrate that the Router functions work as you would expect
import React, { useState } from 'react'

// really simple component taking a name property.
const Hello = ({ name }) => <h2>Hello, {name}</h2>

export const LocalUseStateTest = () => {
  // we don't need a constructor, just initial state variable
  const [editName, setEditName] = useState('')
  const [savedName, setSavedName] = useState('World')

  // when save clicked copy the edited name to the savedname
  const handleClick = (e) => {
    setSavedName(editName)
  }

  // as the render function is pure it should only show props or state with input updates handling state changes
  // using => functions binds to local this so we don't need bind(this).
  const handleChange = (e) => {
    const { value } = e.target
    setEditName(value)
  }

  return (
    <div>
      <Hello name={savedName} />
      <label>Name:&nbsp;
        <input
          type='text' id='editname' name='editname' onChange={handleChange}
          defaultValue={editName} size='20'
        />
      </label>
      <button type='submit' onClick={handleClick}>Save</button>
      <hr />
      <code>{editName}, {savedName}</code>
    </div>
  )
}

export default LocalUseStateTest
