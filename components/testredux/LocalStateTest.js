// Demonstrate that the Router functions work as you would expect
import React, { Component } from 'react'

// really simple component taking a name property.
const Hello = ({ name }) => <h2>Hello, {name}</h2>

export default class LocalStateTest extends Component {
  // we don't need a constructor, just initial state variable
  state = {
    editname: '', // used to collect what is typed
    savedname: 'World' // used to store what is saved
  }

  // when save clicked copy the edited name to the savedname
  handleClick = (e) => {
    this.setState({ savedname: this.state.editname })
  }

  // as the render function is pure it should only show props or state with input updates handling state changes
  // using => functions binds to local this so we don't need bind(this).
  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  render = () => (
    <div>
      <Hello name={this.state.savedname} />
      <label>Name:&nbsp;
        <input type='text' id='editname' name='editname' onChange={this.handleChange}
          defaultValue={this.state.editname} size='20' />
      </label>
      <button type='submit' onClick={this.handleClick}>Save</button>
      <hr />
      <code>{JSON.stringify(this.state)}</code>
    </div>
  )
}
