import test from 'ava'
import PersonListItem from '../PersonListItem'
import { render } from 'enzyme'
import objectid from 'objectid'

const person = {
  _id: objectid().toString(),
  name: 'Testy McTestface',
  nickname: 'Testy',
  imgUrl: 'http://example.com/example.jpg'
}

test('PersonListItem renders properly', t => {
  const wrapper = render(<PersonListItem person={person} />)
  t.is(wrapper.find('h2').first().text(), person.name)
  t.is(wrapper.find('img').first().prop('src'), person.imgUrl)
})
