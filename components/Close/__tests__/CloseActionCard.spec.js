import test from 'ava'
import { shallow } from 'enzyme'
import CloseCard from './CloseActionCard'

test('OpClose renders cards ', t => {
  const wrapper = shallow(<CloseCard imgLink='/static/img/194px-Testcard_F.png' cardTitle='Bake Potatoes' cardDescription='We will Bake Potatoes' />)
  t.is(wrapper.find('img'), '/static/img/194px-Testcard_F.png')
  t.is(wrapper.find('strong').text(), 'Bake Potatoes')
  t.is(wrapper.find('p').last().text(), 'We will Bake Potatoes')
})
