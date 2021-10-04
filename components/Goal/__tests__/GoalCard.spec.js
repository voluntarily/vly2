import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { GoalCardTest, GoalStatusIcon, GoalStartButton } from '../GoalCard'
import { PersonalGoalStatus } from '../../../server/api/personalGoal/personalGoal.constants'
import objectid from 'objectid'
import sinon from 'sinon'

const goal = {
  name: 'Test Goal Card',
  slug: 'goal-show-test-card',
  subtitle: 'Call to action - lets test things',
  description: `
  <div>
    <h1>Test Heading</h1>
    <p>Test paragraph with <strong>strong text</strong></p>
  </div>`,
  imgUrl: '/static/img/goals/teacherSetup.png',
  startLink: '/test',
  group: 'Test',
  evaluation: () => { console.log('Test Goal Card'); return false }
}

test('shallow GoalStartButton', t => {
  const handleClick = sinon.spy()
  let wrapper = shallowWithIntl(
    <GoalStartButton status={PersonalGoalStatus.QUEUED} href='/test' onClick={handleClick} />
  )
  // t.is(wrapper.props().href, '/test')
  t.is(wrapper.find('GoalCard__BottomRightButton').first().props().onClick, handleClick)
  t.is(wrapper.find('MemoizedFormattedMessage').first().props().defaultMessage, 'Start')

  wrapper = shallowWithIntl(
    <GoalStartButton status={PersonalGoalStatus.ACTIVE} href='/test' onClick={handleClick} />
  )
  t.is(wrapper.find('MemoizedFormattedMessage').first().props().defaultMessage, 'Continue')
  wrapper = shallowWithIntl(
    <GoalStartButton status={PersonalGoalStatus.COMPLETED} href='/test' onClick={handleClick} />
  )
  t.is(wrapper.text(), '')
})

test('shallow GoalStatusIcon', t => {
  let wrapper = shallowWithIntl(
    <GoalStatusIcon status={PersonalGoalStatus.QUEUED} />
  )
  t.is(wrapper.text(), '')

  wrapper = shallowWithIntl(
    <GoalStatusIcon status={PersonalGoalStatus.ACTIVE} />
  )
  t.is(wrapper.find('GoalCard__StyledIconLeft').first().props().type, 'paper-clip')
  wrapper = shallowWithIntl(
    <GoalStatusIcon status={PersonalGoalStatus.COMPLETED} />
  )
  t.is(wrapper.find('GoalCard__StyledIconLeft').first().props().type, 'trophy')
})

test('shallow the card with goal', t => {
  const wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} />
  )
  t.is(wrapper.find('GoalCard__CardTitle').first().text(), goal.name)
  t.is(wrapper.find('GoalCard__CardImage').first().props().src, goal.imgUrl)
})

test('shallow the card with a personalGoal', async t => {
  const dispatch = sinon.spy()
  const goalID = objectid().toString()
  const personalGoal = {
    _id: objectid().toString(),
    person: objectid().toString(),
    goal: goalID,
    status: PersonalGoalStatus.QUEUED
  }
  const goal = {
    _id: goalID,
    name: 'Test Goal Card',
    slug: 'goal-show-test-card',
    subtitle: 'Call to action - lets test things',
    description: `
# Test Heading
Test paragraph with *strong text*
`,
    imgUrl: '/static/img/goals/teacherSetup.png',
    startLink: '/test',
    group: 'Test',
    personalGoal,
    status: personalGoal.status,
    evaluation: () => { console.log('Test Goal Card'); return false }
  }

  let wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} dispatch={dispatch} />
  )
  t.is(wrapper.find('GoalCard__CardTitle').first().text(), goal.name)
  t.is(wrapper.find('GoalCard__CardImage').first().props().src, goal.imgUrl)
  t.is(wrapper.find('GoalStatusIcon').first().props().status, PersonalGoalStatus.QUEUED)
  const closeBtn = wrapper.find('GoalCard__StyledIconRight').first()
  t.is(closeBtn.props().type, 'close-circle')
  const event = {
    stopPropagation: sinon.spy()
  }
  goal.status = PersonalGoalStatus.ACTIVE
  wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} dispatch={dispatch} />
  )
  t.is(wrapper.find('GoalStatusIcon').first().props().status, PersonalGoalStatus.ACTIVE)

  goal.status = PersonalGoalStatus.COMPLETED
  wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} dispatch={dispatch} />
  )
  t.is(wrapper.find('GoalStatusIcon').first().props().status, PersonalGoalStatus.COMPLETED)

  // change state to HIDDEN - no card returned
  await closeBtn.props().onClick(event) // handleClose
  goal.status = PersonalGoalStatus.HIDDEN
  wrapper = shallowWithIntl(
    <GoalCardTest goal={goal} dispatch={dispatch} />
  )
  t.is(wrapper.text(), '')
})
