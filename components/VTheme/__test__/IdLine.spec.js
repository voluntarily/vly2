import test from 'ava'
import IdLine from '../IdLine'
import { render } from 'enzyme'
import objectid from 'objectid'

const person = {
  _id: objectid().toString(),
  name: 'Testy McTestface',
  imgUrl: 'http://example.com/example.jpg'
}

test('IdLine renders properly', t => {
  const wrapper = render(<IdLine item={person} type='person' />)
  t.is(wrapper.find('span').last().text(), person.name)
  t.is(wrapper.find('img').first().prop('src'), person.imgUrl)
})

test('IdLine with no props is blank', t => {
  const wrapper = render(<IdLine />)
  t.is(wrapper.text(), '')
})
