import { Button, Steps } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import AllDone from '../../components/SignUp/AllDone'
import ChooseParticipation from '../../components/SignUp/ChooseParticipation'
import { FullPage } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import callApi from '../../lib/callApi'
import reduxApi from '../../lib/redux/reduxApi'
import { useSelector } from 'react-redux'
import { Role } from '../../server/services/authorize/role'

const { Step } = Steps

const PostSignUp = () => {
  const me = useSelector(state => state.session.me)
  const [step, setStep] = useState(0)
  const [roleAsk, setRoleAsk] = useState(true)
  const [roleOffer, setRoleOffer] = useState(me.role.includes(Role.VOLUNTEER))
  // const orgs = useSelector(state => state.organisations.data)
  const router = useRouter()

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step > 0 && step - 1)
  }

  const lastStep = async () => {
    if (roleOffer) { await callApi('registerVolunteer') }
    router.replace('/home')
  }
  const NextPrevBtns = ({ next, prev, done }) => {
    return (
      <>
        {next && (
          <Button type='primary' shape='round' onClick={nextStep}>
            <FormattedMessage defaultMessage='Next' id='PostSignUp.btn.next' />
          </Button>
        )}
        {done && (
          <Button type='primary' shape='round' onClick={lastStep}>
            <FormattedMessage defaultMessage='Done' id='PostSignUp.btn.done' />
          </Button>
        )}
        {prev && (
          <Button shape='round' style={{ margin: 8 }} onClick={prevStep}>
            <FormattedMessage defaultMessage='Previous' id='PostSignUp.btn.previous' />
          </Button>
        )}
      </>
    )
  }

  const steps = [
    // {
    //   title: <FormattedMessage defaultMessage='Welcome' id='PostSignUp.step.welcome' />,
    //   content: (
    //     <WelcomeToVoluntarily>
    //       <NextPrevBtns next />
    //     </WelcomeToVoluntarily>
    //   )
    // },
    {
      title: <FormattedMessage defaultMessage='Choose Participation' id='PostSignUp.step.participate' />,
      content: (
        <ChooseParticipation
          roleAsk={roleAsk} onChangeAsk={setRoleAsk}
          roleOffer={roleOffer} onChangeOffer={setRoleOffer}
        >
          <NextPrevBtns next />
        </ChooseParticipation>
      )
    },
    // ,{
    //   title: 'Location',
    //   content: <ChooseParticipation />
    // },

    // {
    //   title: 'Topic',
    //   content: 'Last-content'
    // }
    {
      title: <FormattedMessage defaultMessage='Done' id='PostSignUp.step.done' />,
      content: (
        <AllDone>
          <NextPrevBtns done prev />
        </AllDone>
      )
    }
  ]

  return (
    <FullPage>
      <h1><FormattedMessage defaultMessage='Welcome to Voluntarily' id='PostSignUp.title' /></h1>

      <p>
        <FormattedMessage
          id='PostSignUp.intro'
          defaultMessage='To get you setup we have a few quick questions.'
        />
      </p>
      <Steps current={step}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div>{steps[step].content}</div>
    </FullPage>
  )
}

PostSignUp.getInitProps = async ({ store, query }) => {
  try {
    await store.dispatch(reduxApi.actions.organisations.get())
  } catch (err) {
    console.error('error in getting organisations data', err)
  }
}

export default securePage(PostSignUp)
