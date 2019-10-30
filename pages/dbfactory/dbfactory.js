import React, { Component } from 'react'
import { Button, message } from 'antd'
// import fetch from 'isomorphic-fetch'
import publicPage from '../../hocs/publicPage'
import TitleSection from '../../components/LandingPageComponents/TitleSection'
import callApi from '../../lib/apiCaller'
import { FullPage } from '../../components/VTheme/VTheme'
export class DBfactory extends Component {
  constructor (props) {
    super(props)
    this.state = { people: 1, ops: 1 }
    this.handleQuery = this.handleQuery.bind(this)
  }

  handleQuery = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleApiCall = async () => {
    const URL = callApi(`db/initdb?people=${this.state.people}&ops=${this.state.ops}`)
      .then(res => {
        console.log(res)
        message.success(`successfully generated ${this.state.people} people & ${this.state.ops} opportunity record`)
      })
      .then()
      .catch(err => console.log(err))
    return URL
  }

  render () {
    const divtextbox = {
      width: '200px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
    const generatebutton = {
      width: '100px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
    const divcenter = {
      margin: 'auto',
      width: '100%',
      border: '3px',
      padding: '10px'
    }
    return (
      <FullPage>
        <div className='ant-row ant-form-item' style={divcenter}>
          <div className='ant-form-item-control'>

            <TitleSection title='Use the below fields to generate random people and opportunities data' />
            <div style={divtextbox}>
              <span className='ant-form-item-children'>People &nbsp;</span>
              <input className='ant-input' type='text' name='people' onChange={this.handleQuery} value={this.state.people} /><br />
              <span className='ant-form-item-children'>Opportunity &nbsp;</span>
              <input className='ant-input' type='text' name='ops' onChange={this.handleQuery} value={this.state.ops} /><br />
            &nbsp;
            </div>
            <div style={generatebutton}>
              <Button className='ant-btn ant-btn-primary' onClick={this.handleApiCall}>Generate</Button>
            </div>

          </div>
        </div>
      </FullPage>
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
// const URL = `${API_URL}/db/initdb?people=${this.state.people}&ops=${this.state.ops}`
// let headers = {
//   'content-type': 'application/json'
// }
// fetch(URL, {
//   headers: headers,
//   method: 'POST'
// })
//   .then((res) => {
//     console.log(res)
//     if (res.status === 200) {
//       message.success(`successfully generated ${this.state.people} people & ${this.state.ops} opportunity record`)
//     }
//   }
//   )
//   .catch(err => console.log(err))

// const API_URL = process.env.VLY_URL || 'http://localhost:3122'
// const URL = `https://alpha.voluntari.ly/api/db/initdb?people=${this.state.people}&ops=${this.state.ops}`
