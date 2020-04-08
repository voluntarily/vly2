import publicPage from '../../hocs/publicPage'
import { FullPage } from '../../components/VTheme/VTheme'
import { Steps, Button, message } from 'antd'
import { useState } from 'react'
import WelcomeToVoluntarily from '../../components/SignUp/WelcomeToVoluntarily'
import GettingStarted from '../../components/SignUp/GettingStarted'
const { Step } = Steps

const steps = [
  {
    title: 'Welcome',
    content: <WelcomeToVoluntarily />
  },
  {
    title: 'Getting Started',
    content: <GettingStarted />
  },
  {
    title: 'Location',
    content: <GettingStarted />
  },

  {
    title: 'Topic',
    content: 'Last-content'
  }
]

const PostSignUp = () => {
  const [step, setStep] = useState(0)

  const next = () => {
    setStep(step + 1)
  }

  const prev = () => {
    setStep(step > 0 && step - 1)
  }

  return (
    <div>
      <Steps current={step}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div>{steps[step].content}</div>
      <div>
        {step < steps.length - 1 && (
          <Button type='primary' shape='round' onClick={next}>
            Next
          </Button>
        )}
        {step === steps.length - 1 && (
          <Button type='primary' shape='round' onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {step > 0 && (
          <Button shape='round' style={{ margin: 8 }} onClick={prev}>
            Previous
          </Button>
        )}
      </div>
    </div>
  )
}

export const PresignAccept = () =>
  <FullPage>
    <h1>Complete Registration</h1>
    <PostSignUp />
  </FullPage>
export default publicPage(PresignAccept)
