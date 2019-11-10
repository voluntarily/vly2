import { Button, Divider } from 'antd'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { FormattedMessage } from 'react-intl'
import TeacherRegistrationRecord from '../../components/Person/Teacher/TeacherRegistrationRecord'
import GetTeacherRegistration from '../../components/Person/Teacher/GetTeacherRegistration'
import { FullPage, SpacerSmall } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import callApi from '../../lib/callApi'

export function RegisterTeacher () {
  const [teacherRegistrationRecord, setTeacherRegistrationRecord] = useState()
  const [init, setInit] = useState(false)

  useEffect(() => {
    async function fetchData () {
      try {
        const data = await callApi('registerRequestor')
        setTeacherRegistrationRecord(data.teacher.registration)
      } catch (e) {
        console.error('GetTeacherRegNo:', e)
      }
      setInit(true)
    }
    fetchData()
  }, [])

  const handleResetTeacherRegistration = () => {
    setTeacherRegistrationRecord(null)
    callApi('registerRequestor/reset')
      .catch(e => { console.error(e) })
  }
  return (
    <FullPage>
      <Helmet>
        <title>Voluntarily - Register as a Teacher</title>
      </Helmet>
      <h3>
        <FormattedMessage
          id='registerRequestor.asaRequestor'
          defaultMessage='Enable Requestor Status'
        />
      </h3>
      <p>
        <FormattedMessage
          id='registerRequestor.intro'
          defaultMessage='In order to create new opportunities in Voluntarily you will need to register as a teacher or opportunity provider. '
        />
      </p>
      <SpacerSmall />
      <h2>
        <FormattedMessage
          id='registerRequestor.asaTeacher'
          defaultMessage='Register as a Teacher'
        />
      </h2>

      {/* <JoinSchool /> */}
      {teacherRegistrationRecord
        ? (
          <>
            <TeacherRegistrationRecord trr={teacherRegistrationRecord} />
            <Button onClick={handleResetTeacherRegistration}>Reset Registration</Button>
          </>)
        : init && <GetTeacherRegistration onChange={data => setTeacherRegistrationRecord(data.teacher.registration)} />}

      <Divider />
      {/* <h2>
        <FormattedMessage
          id='registerRequestor.asanActivityProvider'
          defaultMessage='Register as an Activity Provider'
        />
      </h2> */}
    </FullPage>
  )
}

// const JoinSchool = () =>
//   <h5>
//     <FormattedMessage
//       id='registerTeacher.joinSchool'
//       defaultMessage='Find and join your school'
//     />
//     <p>
//       <FormattedMessage
//         id='registerTeacher.joinSchoolInstructions'
//         defaultMessage='Enter school name: (awaiting schools database)'
//       />
//       <Input disabled />
//     </p>
//   </h5>
export default securePage(RegisterTeacher)
