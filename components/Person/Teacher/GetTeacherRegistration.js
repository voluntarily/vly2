import { Alert, Input } from 'antd'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import callApi from '../../../lib/callApi'
import Link from 'next/link'
import PropTypes from 'prop-types'
const { Search } = Input

/*
Registration signals that a teacher has met the initial requirements for
entry to the teaching profession.  This includes checking that the teacher
is satisfactorily trained to teach, of good character and fit to be a
teacher, including having a satisfactory Police vet.  Registration is only
approved once, and does not expire.

A practising certificate provides assurance from the Education Council
about a teacher's good character (including having a satisfactory Police vet),
fitness to teach and competence. Certificated teachers must have both
registration and a practising certificate in order to teach.

This component collects a NZ Teacher Registration Number and calls the
registerRequestor API which looks it up at https://teachingcouncil.nz
and if present and matching names, updates the signed in person record
teacher field and If valid sets the person to be an OP.

calls back to the parent when a result is received.
*/

export const RegError = () =>
  <>
    <FormattedMessage
      id='getTeacherRegistration.registrationError'
      defaultMessage='Registration number not found, does not match your name, or is expired please verify at&nbsp;'
    />
    <Link href='https://teachingcouncil.nz/search-the-register'>
      NZ Teaching Council
    </Link>
  </>

export const GetTeacherRegistration = ({ onChange }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleTeacherRegNo = async (regNo) => {
    setLoading(true)
    setError(false)
    try {
      const data = await callApi(`registerRequestor?trn=${regNo}`)
      onChange(data)
    } catch (e) {
      console.error('GetTeacherRegistration:', e)
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div>
      <p>
        <FormattedMessage
          id='registerTeacher.methods'
          defaultMessage='You can validate as a teacher using your teacher registration number:'
        />
      </p>
      <h5>
        <FormattedMessage
          id='registerTeacher.intro'
          defaultMessage='Enter your NZ Teacher Registration Number'
        />
      </h5>
      <Search
        placeholder='000000'
        loading={loading} enterbutton='true'
        onSearch={value => handleTeacherRegNo(value)}
        style={{ width: 200 }}
      />
      {error &&
        <Alert message={<RegError />} type='error' />}
    </div>
  )
}

GetTeacherRegistration.propTypes = {
  onChange: PropTypes.func.isRequired
}
export default GetTeacherRegistration
