import { useState, useEffect } from 'react'

import { FullPage } from '../../components/VTheme/VTheme'
import SchoolInviteForm from '../../components/Org/SchoolInviteForm'
import fetch from 'isomorphic-fetch'
import callApi from '../../lib/callApi'
import AccessDenied from '../../components/Navigation/AccessDenied'

const InviteSchool = ({ isAdmin }) => {
  const [schools, setSchools] = useState([])
  useEffect(() => {
    const getSchools = async () => {
      const schoolsList = await callApi('schools?p=schoolId%20name', 'GET')
      setSchools(schoolsList)
    }
    getSchools()
  }, [])

  if (!isAdmin) return <AccessDenied />

  const handleSubmit = async (invite) => {
    const response = await fetch('/api/notify/school-invite', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(invite),
      headers: { 'Content-Type': 'application/json' }
    })

    return response.ok
  }
  return (
    <FullPage>
      <SchoolInviteForm onSubmit={handleSubmit} schoolOptions={schools} />
    </FullPage>
  )
}

export default InviteSchool
