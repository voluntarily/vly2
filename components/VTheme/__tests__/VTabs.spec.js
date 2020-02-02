import test from 'ava'
import { render } from 'enzyme'
import { VTabs } from '../VTabs'

test('Check Tabs Render', t => {
//   t.context.act.volunteers = 0.2
  const wrapper = render(<VTabs />)
  t.is(wrapper.find('VTabs').length, 1)
})
