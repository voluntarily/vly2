import React, { Component } from 'react'
import { Button, message } from 'antd'
// import axios from 'axios'
import fetch from 'isomorphic-fetch'
import publicPage from '../../hocs/publicPage'
import TitleSection from '../../components/LandingPageComponents/TitleSection'
export class DBfactory extends Component {
  constructor (props) {
    super(props)
    this.state = { people: 1, ops: 1 }
    this.queryHandler = this.queryHandler.bind(this)
  }
  queryHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  apicallHandler = () => {
    const API_URL = process.env.VLY_URL || 'http://localhost:3122'
    const URL = `${API_URL}/api/db/initdb?people=${this.state.people}&ops=${this.state.ops}`
    let headers = {
      'content-type': 'application/json'
    }
    fetch(URL, {
      headers: headers,
      method: 'POST'
    })
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          message.success(`successfully generated ${this.state.people} people & ${this.state.ops} opportunity record`)
        }
        // if (res.status === 200 && this.state.people === null) {
        //   console.log('no people')
        // }
        // if (res.status === 200 && this.state.ops === null) {
        //   console.log('no ops')
        // }
        // if (this.state.ops === null) {
        //   console.log('no ops')
        // }
      }
      )
      .catch(err => console.log(err))
  }
  render () {
    const divtextbox = {
      width: '200px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
    const span = {
      marginLeft: '30%',
      marginRight: '30%'
    }
    const divcenter = {
      margin: 'auto',
      width: '100%',
      border: '3px',
      padding: '10px'
    }
    return (
      <div className='ant-row ant-form-item' style={divcenter}>
        <div className='ant-form-item-control'>
          <div className='ant-col ant-form-item-control-wrapper'>

            <div style={divcenter}>
              <TitleSection title='To generate random people and opportunities data' />
              <div style={divtextbox}>
                <span className='ant-form-item-children'>People &nbsp;</span>
                <input className='ant-input' type='text' name='people' onChange={this.queryHandler} value={this.state.people} /><br />
                <span className='ant-form-item-children'>Opportunity &nbsp;</span>
                <input className='ant-input' type='text' name='ops' onChange={this.queryHandler} value={this.state.ops} /><br />
              </div>

            </div>
            <div style={divtextbox}>
              <Button className='ant-btn ant-btn-primary' onClick={this.apicallHandler}>Generate</Button>
            </div>
          </div>

        </div>
      </div>

    )
  }
}

export default publicPage(DBfactory)

// this.setState({
//   query: [
//     { people: event.target.value },
//     { ops: event.target.value }
//   ]
// })
// console.log(this.state.query[0].people)
// console.log(event.target.name.value)

// console.log(this.state.people)
// console.log(this.state.ops)
// this.state.history.push(`api/health/initdb?people=${this.state.people}&ops=${this.state.ops}`)

// this.state = {
//   query: [
//     { people: 1 },
//     { ops: 2 }
//   ]
// }
// this.handleSubmit = this.handleSubmit.bind(this)
// console.log(data, config, API_URL)
// axios.post(`${API_URL}/api/db/initdb`,JSON.stringify(data), config
// )
//   .then(res => {
//     console.log(res)
//   }).catch(err => {
//     console.log(err)
//   })
