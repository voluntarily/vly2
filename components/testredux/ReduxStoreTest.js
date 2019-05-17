// Demonstrate that the Router functions work as you would expect
import React, { Component } from 'react'
import { connect } from 'react-redux'

// really simple component taking a name property.
const Hello = ({ name }) => <h2>Hello, {name}</h2>

export const SET_NAME = 'SET_NAME' // allows us to use the type without redefining strings everywhere

export const setName = (name) => {
  return {
    type: SET_NAME,
    name
  }
}

const initialState = { name: '' }

export const ReduxStoreTestReducer = (state = initialState, action) => {
  // console.log('ReduxStoreTestReducer', action, state)
  switch (action.type) {
    case SET_NAME:
      // console.log('Reducing SET_NAME')
      return { ...state, name: action.name }
    default:
      return state
  }
}

export class ReduxStoreTest extends Component {
  // we don't need a constructor, just initial state variable
  state = {
    editname: '' // still used to collect what is typed, very local
  }

  // when save clicked copy the edited name to the savedname
  handleClick = (e) => {
    // console.log('handleClick', this.state.editname)
    // call redux dispatch with the setName Action and our new data.
    this.props.setName(this.state.editname)
  }

  // as the render function is pure it should only show props or state with input updates handling state changes
  // using => functions binds to local this so we don't need bind(this).
  handleChange = (e) => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  render = () => (
    <div>
      <Hello name={this.props.name} />
      <label>Name:&nbsp;
        <input type='text' id='editname' name='editname' onChange={this.handleChange} size='20' />
      </label>
      <button type='submit' onClick={this.handleClick}>Save</button>
      <hr />
      <code>{JSON.stringify(this.state)}</code>
      <code>{JSON.stringify(this.store)}</code>
    </div>
  )
}

// Copy out the bit of state we are interested in.
const mapStateToProps = (store) => ({
  name: store.rst ? store.rst.name : ''
})

export default connect(mapStateToProps, { setName })(ReduxStoreTest)
