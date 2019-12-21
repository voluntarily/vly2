import test from 'ava'
import OrgCategory from '../OrgCategory'
import { render } from 'enzyme'
import { Category } from '../../../server/api/organisation/organisation.constants'

test('OrgCategory with single item', t => {
  const one = [Category.BUSINESS]
  const wrapper = render(<OrgCategory orgCategory={one} />)
  t.is(wrapper.find('li').length, 1)
  t.true(wrapper.find('i').first().hasClass('anticon-bank'))
})
test('OrgCategory with many item', t => {
  const all = [
    Category.BUSINESS,
    Category.SCHOOL,
    Category.ACTIVITYPROVIDER,
    Category.AGENCY,
    Category.OTHER
  ]
  const wrapper = render(<OrgCategory orgCategory={all} />)

  t.is(wrapper.find('li').length, all.length)
  t.true(wrapper.find('i').first().hasClass('anticon-bank'))
  t.true(wrapper.find('i').last().hasClass('anticon-question-circle'))
})

test('OrgCategory with zero items', t => {
  const none = []
  const wrapper = render(<OrgCategory orgCategory={none} />)
  console.log(wrapper.html())

  t.is(wrapper.find('li').length, 0)
})
