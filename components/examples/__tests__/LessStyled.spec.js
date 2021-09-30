import test from 'ava'
import { shallow } from 'enzyme'
import LessStyled from '../LessStyled'

test('renders properly', t => {
  const wrapper = shallow(
    <LessStyled />
  )

  t.truthy(wrapper.hasClass('example'))
  t.is(wrapper.find('p').first().prop('children'), 'Less Styled Example')
  // test the action font size.
})
