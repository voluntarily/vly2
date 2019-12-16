
import React, { useState } from 'react'
import { Button, InputNumber, message } from 'antd'
import securePage from '../../hocs/securePage'
import callApi from '../../lib/callApi'
import { FullPage, Section } from '../../components/VTheme/VTheme'

export const Admin = () => {
  const [people, setPeople] = useState(3)
  const [ops, setOps] = useState(3)

  const handleGenerateEntities = async () => {
    const URL = callApi(`db/initdb?people=${people}&ops=${ops}`)
      .then(res => {
        message.success(`successfully generated ${people} people & ${ops} opportunity records`)
      })
      .then()
      .catch(err => console.log(err))
    return URL
  }

  return (
    <FullPage>
      <Section>
        <h2>Generate Test People and Opportunities</h2>
        <p>Use the fields below to populate a test database</p>
        <label>People: </label>
        <InputNumber
          style={{ marginRight: '2rem' }}
          min={1} max={100}
          onChange={val => setPeople(val)}
          value={people}
        />
        <label>Opportunities: </label>
        <InputNumber
          style={{ marginRight: '2rem' }}
          min={1} max={100}
          onChange={val => setOps(val)}
          value={ops}
        />
        <Button shape='round' type='primary' onClick={handleGenerateEntities}>Generate</Button>
      </Section>
    </FullPage>
  )
}

export default securePage(Admin)

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
