import test from 'ava'
import { shallow, mount } from 'enzyme'
import Uploader from '../Upload'

// Demonstrate that the uploader loads without special needs
// Uploader includes an Iframe which doesn't work in our test environemtn
test.skip('renders shallow', t => {
  const wrapper = shallow(
    <Uploader />
  )
  t.is(wrapper.find('Button').first().children().last().text(), 'Click to Upload')
})

test.skip('renders deep', t => {
  const wrapper = mount(
    <Uploader />
  )
  t.is(wrapper.find('button').first().children().last().text(), 'Click to Upload')
})
