import test from 'ava'
import Hello from '../Hello'
import { mount } from 'enzyme'
import withMockRoute from '../../../server/util/mockRouter'

test('renders properly', t => {
  const RoutedHello = withMockRoute(Hello, '/about')
  const wrapper = mount(<RoutedHello />)
  t.truthy(wrapper.find('p').first().hasClass('greeting'))
  t.is(wrapper.find('p').first().text(), 'Hello World!')
  t.is(wrapper.find('p').at(1).text(), '/about')
})
