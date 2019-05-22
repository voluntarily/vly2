// Demonstrate that the Router functions work as you would expect
import React, { Component } from 'react'
import { connect } from 'react-redux'
import callApi from '../../lib/apiCaller'

const ADD_HEALTH = 'ADD_HEALTH' // allows us to use the type without redefining strings everywhere

function addHealth (health) {
  return {
    type: ADD_HEALTH,
    health
  }
}

export function fetchHealth () {
  return dispatch => {
    return callApi('health').then(res => {
      dispatch(addHealth(res))
    })
  }
}
const initialState = {
  message: 'Pending',
  health: 'Unknown'
}

export const HealthReducer = (state = initialState, action) => {
  // console.log('ReduxAsyncTestReducer', action)
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
//   console.log(store)
//   return ({
//     health: store.health,
//     name: store.rst.name
//   })
// }
export default connect(
  mapStateToProps,
  { fetchHealth }
)(ReduxAsyncTest)
