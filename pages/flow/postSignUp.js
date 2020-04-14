import { Button, Steps } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import AllDone from '../../components/SignUp/AllDone'
import AcceptPrivacy from '../../components/SignUp/AcceptPrivacy'
import SelectTopicGroup from '../../components/SignUp/SelectTopicGroup'
import ChooseParticipation from '../../components/SignUp/ChooseParticipation'
import { FullPage } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import callApi from '../../lib/callApi'
import reduxApi from '../../lib/redux/reduxApi'
import { useSelector } from 'react-redux'
import { Role } from '../../server/services/authorize/role'
import { AcceptAndContinueButton } from '../../components/VTheme/Buttons'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

const { Step } = Steps

const PostSignUp = () => {
  const me = useSelector(state => state.session.me)
  const [step, setStep] = useState(0)
  const [roleAsk, setRoleAsk] = useState(true)
  const [roleOffer, setRoleOffer] = useState(me.role.includes(Role.VOLUNTEER))
  const [topicGroups, setTopicGroups] = useState({ business: false, community: false, education: false })

  // const orgs = useSelector(state => state.organisations.data)
  const router = useRouter()
  const opType = roleOffer ? OFFER : ASK

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step > 0 && step - 1)
  }

  const lastStep = async () => {
    const profileUpdate = {
      roleOffer,
      roleAsk,
      topicGroups: Object.keys(topicGroups).filter(key => topicGroups[key])
    }
    console.log(profileUpdate.topicGroups)
    callApi('signUp', 'post', profileUpdate)

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
  const handleSelectTopicGroup = update => {
    setTopicGroups({ ...topicGroups, ...update })
  }
  const steps = [
    {
      title: <FormattedMessage defaultMessage='Protecting your Privacy' id='PostSignUp.step.privacy' />,
      content: (
        <AcceptPrivacy>
          <AcceptAndContinueButton onClick={nextStep} />
        </AcceptPrivacy>
      )
    },
    {
      title: <FormattedMessage defaultMessage='How to get started' id='PostSignUp.step.participate' />,
      content: (
        <ChooseParticipation
          roleAsk={roleAsk} onChangeAsk={setRoleAsk}
          roleOffer={roleOffer} onChangeOffer={setRoleOffer}
        >
          <NextPrevBtns next prev />
        </ChooseParticipation>
      )
    },
    {
      title: <FormattedMessage defaultMessage='Topic Group' id='PostSignUp.step.topicgroup' />,
      content: (
        <SelectTopicGroup
          type={opType} topicGroups={topicGroups} onChange={handleSelectTopicGroup}
        >
          <NextPrevBtns next prev />
        </SelectTopicGroup>
      )
    },
    // ,{
    //   title: 'Location',
    //   content: <ChooseParticipation />
    // },

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
      <h1><FormattedMessage defaultMessage='Getting Started' id='PostSignUp.title' /></h1>

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
      <pre>{JSON.stringify(topicGroups)}</pre>
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
