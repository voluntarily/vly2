import { Button, Steps } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import AllDone from '../../components/SignUp/AllDone'
import AboutYou from '../../components/SignUp/AboutYou'
import AcceptPrivacy from '../../components/SignUp/AcceptPrivacy'
import SelectTopicGroup from '../../components/SignUp/SelectTopicGroup'
import ChooseParticipation from '../../components/SignUp/ChooseParticipation'
import { FullPage } from '../../components/VTheme/VTheme'
import securePage from '../../hocs/securePage'
import callApi from '../../lib/callApi'
import { useSelector } from 'react-redux'
import { Role } from '../../server/services/authorize/role'
import { AcceptAndContinueButton } from '../../components/VTheme/Buttons'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'
const { ASK, OFFER } = OpportunityType

const { Step } = Steps
const messages = defineMessages({
  privacy: { id: 'PostSignUp.step.privacy', defaultMessage: 'Protecting your Privacy' },
  participate: { id: 'PostSignUp.step.participate', defaultMessage: 'Participate' },
  topicgroups: { id: 'PostSignUp.step.topicgroups', defaultMessage: 'Groups' },
  aboutyou: { id: 'PostSignUp.step.aboutyou', defaultMessage: 'About you' },
  done: { id: 'PostSignUp.step.done', defaultMessage: 'Done' }
})

const PostSignUp = () => {
  const me = useSelector(state => state.session.me)
  const [step, setStep] = useState(0)
  const [roleAsk, setRoleAsk] = useState(me.role.includes(Role.BASIC))
  const [roleOffer, setRoleOffer] = useState(me.role.includes(Role.VOLUNTEER))
  const [topicGroups, setTopicGroups] = useState({ business: false, community: false, education: false })
  const [person, setperson] = useState({
    nickname: me.nickname,
    imgUrl: me.imgUrl,
    imgUrlSm: me.imgUrlSm,
    locations: me.locations
  })
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
      topicGroups: Object.keys(topicGroups).filter(key => topicGroups[key]),
      person
    }
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
            <FormattedMessage defaultMessage='Confirm' id='PostSignUp.btn.done' />
          </Button>
        )}
        {prev && (
          <Button shape='round' style={{ margin: 8 }} onClick={prevStep}>
            <FormattedMessage defaultMessage='Back' id='PostSignUp.btn.previous' />
          </Button>
        )}
      </>
    )
  }
  const handleSelectTopicGroup = update => {
    setTopicGroups({ ...topicGroups, ...update })
  }
  const handleAboutYou = update => {
    setperson({ ...person, ...update })
  }
  const { formatMessage } = useIntl()
  const steps = [
    {
      title: formatMessage(messages.privacy),
      content: (
        <AcceptPrivacy>
          <AcceptAndContinueButton onClick={nextStep} />
        </AcceptPrivacy>
      )
    },
    {
      title: formatMessage(messages.aboutyou),
      content: (
        <AboutYou person={person} onChange={handleAboutYou}>
          <NextPrevBtns next prev />
        </AboutYou>
      )
    },
    {
      title: formatMessage(messages.participate),
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
      title: formatMessage(messages.topicgroups),
      content: (
        <SelectTopicGroup
          type={opType} topicGroups={topicGroups} onChange={handleSelectTopicGroup}
        >
          <NextPrevBtns next prev />
        </SelectTopicGroup>
      )
    },
    {
      title: formatMessage(messages.done),
      content: (
        <AllDone
          type={opType}
          topicGroups={topicGroups}
          person={person}
        >
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
      <Steps current={step} onChange={current => setStep(current)}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div>{steps[step].content}</div>
    </FullPage>
  )
}

export default securePage(PostSignUp)
