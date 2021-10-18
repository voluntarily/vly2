
import { FullPage } from '../../components/VTheme/VTheme'
import EducationSelector from '../../components/Form/Input/EducationSelector'
import { useState } from 'react'

const Hi = () => {
  const [education, setEducation] = useState('')
  const handleEducationChange = (value) => {
    console.log(value)
    setEducation(value)
  }
  return (
    <FullPage>
      <h1>Education Selector Example</h1>
      <EducationSelector onChange={handleEducationChange} value={education} />
      <p>{education}</p>
    </FullPage>
  )
}

export default Hi
