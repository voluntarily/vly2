// Demonstrate that the Router functions work as you would expect
import React, { Component } from 'react'
import { connect } from 'react-redux'
import callApi from '../../lib/callApi'

const ADD_HEALTH = 'ADD_HEALTH' // allows us to use the type without redefining strings everywhere

function addHealth (health) {
  return {
    type: ADD_HEALTH,
    health
  }
}
const BadHealth = {
  message: 'Hello from Voluntari.ly V0.0.2',
  health: 'Not OK'
}

export function fetchHealth () {
  return dispatch => {
    return callApi('health').then(res => {
      dispatch(addHealth(res))
    },
    _err => { dispatch(addHealth(BadHealth)) }
    )
  }
}
const initialState = {
  message: 'Pending',
  health: 'Unknown'
}

export const HealthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_HEALTH:
      return { ...action.health }
    default:
      return state
  }
}

export class ReduxAsyncTest extends Component {
  // when save clicked copy the edited name to the savedname
  handleClick = e => {
    // call redux dispatch with the addHealth Action and our new data.
    this.props.fetchHealth()
  }

  render = () => (
    <div>
      <p>Hi {this.props.name}</p>
      <p>Health is {this.props.health.health}</p>
      <p>Message is {this.props.health.message}</p>
      <button type='button' onClick={this.handleClick}>
        Get Health
      </button>
      <hr />
      <code>{JSON.stringify(this.props.health)}</code>
    </div>
  )
}

// Copy out the bit of state we are interested in.
const mapStateToProps = store => ({
  health: store.health,
  name: store.rst.name
})

// longer version
// const mapStateToProps = (store) => {
//   return ({
//     health: store.health,
//     name: store.rst.name
//   })
// }
export default connect(
  mapStateToProps,
  { fetchHealth }
)(ReduxAsyncTest)
