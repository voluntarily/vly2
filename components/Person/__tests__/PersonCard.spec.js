import test from 'ava'
import PersonCard from '../PersonCard'
import { render } from 'enzyme'
import objectid from 'objectid'

const person = {
  _id: objectid().toString(),
  name: 'Testy McTestface',
  nickname: 'Testy',
  avatar: 'http://example.com/example.jpg'
}

test('PersonCard renders properly', t => {
  const wrapper = render(<PersonCard person={person} />)
  t.is(wrapper.find('.personTitle').first().text(), person.nickname)
  t.is(wrapper.find('.personName').first().text(), person.name)
})
