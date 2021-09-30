import test from 'ava'
import LessStyled from '../LessStyled'
import { shallow } from 'enzyme'

test('renders properly', t => {
  const wrapper = shallow(
    <LessStyled />
  )

  t.truthy(wrapper.hasClass('example'))
  t.is(wrapper.find('p').first().prop('children'), 'Less Styled Example')
  // test the action font size.
})
