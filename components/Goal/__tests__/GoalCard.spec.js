import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'

import GoalCard from '../GoalCard'

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
  category: 'Test',
  evaluation: () => { console.log('Test Goal Card'); return false }
}

test('shallow the card with goal', t => {
  const wrapper = shallowWithIntl(
    <GoalCard goal={goal} />
  )
  t.is(wrapper.props().href, '/test')
  t.is(wrapper.find('GoalCard__CardTitle').first().text(), goal.name)
  t.is(wrapper.find('GoalCard__CardImage').first().props().src, goal.imgUrl)
})
