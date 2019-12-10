import React, { Component } from 'react'
import { FullPage } from '../../components/VTheme/VTheme'
import adminPage from '../../hocs/adminPage'
import SchoolInviteForm from '../../components/Org/SchoolInviteForm'
import fetch from 'isomorphic-fetch'
import callApi from '../../lib/callApi'

class InviteSchool extends Component {
  static async getInitialProps () {
    const schools = await callApi('schools?p=schoolId%20name')

    return {
      schools: schools
    }
  }

  render () {
    return (
      <FullPage>
        <SchoolInviteForm onSubmit={this.handleSubmit} schoolOptions={this.props.schools} />
      </FullPage>
    )
  }

  async handleSubmit (invite) {
    const response = await fetch('/api/notify/school-invite', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(invite),
      headers: { 'Content-Type': 'application/json' }
    })

    return response.ok
  }
}

export default adminPage(InviteSchool)
