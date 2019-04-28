import test from 'ava';
import Hello from '../Hello'
import { shallow } from 'enzyme';

test('renders properly', t => {
  const wrapper = shallow(
    <Hello />
  );

  t.truthy(wrapper.hasClass('greeting'));
  t.is(wrapper.find('p').first().prop('children'), 'Hello World!');
});