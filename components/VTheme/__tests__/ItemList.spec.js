import test from 'ava'
import {
  ItemNeeds,
  ItemListing,
  ItemDuration,
  ItemStatus,
  EquipmentList,
  ItemIdLine,
  ItemDate,
  ItemLocation,
  ItemVenue,
  ItemResource,
  ItemSpace
} from '../ItemList'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

test('render EquipmentList', t => {
  const equipment = [
    'a tisket', 'a tasket', 'a little yellow basket'
  ]
  const wrapper = renderWithIntl(<EquipmentList equipment={equipment} />)
  t.true(wrapper.exists(EquipmentList))
})

test('render empty EquipmentList', t => {
  const equipment = []
  const wrapper = renderWithIntl(<EquipmentList equipment={equipment} />)
  t.true(wrapper.exists(EquipmentList))
})
test('render null EquipmentList', t => {
  const wrapper = renderWithIntl(<EquipmentList />)
  t.true(wrapper.exists(EquipmentList))
})
test('render ItemIdLine', t => {
  const id = {
    _id: '1234565432345432',
    name: 'A Real Name',
    imgUrl: 'https://example.com/goat.png'
  }
  const wrapper = renderWithIntl(<ItemIdLine item={id} path='/person' />)
  t.true(wrapper.exists(ItemIdLine))
})

test('render null ItemIdLine', t => {
  const wrapper = renderWithIntl(<ItemIdLine />)
  t.true(wrapper.exists(ItemIdLine))
})

test('render ItemStatus', t => {
  const wrapper = renderWithIntl(<ItemStatus status='Active' />)
  t.true(wrapper.exists(ItemStatus))
})

test('render ItemSpace', t => {
  const wrapper = renderWithIntl(<ItemSpace space='1 acre' />)
  t.true(wrapper.exists(ItemSpace))
})

test('render null ItemSpace', t => {
  const wrapper = renderWithIntl(<ItemSpace />)
  t.true(wrapper.exists(ItemSpace))
})
test('render ItemResource', t => {
  const wrapper = renderWithIntl(<ItemResource resource='bell' />)
  t.true(wrapper.exists(ItemResource))
})
test('render null ItemResource', t => {
  const wrapper = renderWithIntl(<ItemResource />)
  t.true(wrapper.exists(ItemResource))
})
test('render ItemLocation', t => {
  const wrapper = renderWithIntl(<ItemLocation location='Northland' />)
  t.true(wrapper.exists(ItemLocation))
})

test('render null ItemLocation', t => {
  const wrapper = renderWithIntl(<ItemLocation />)
  t.true(wrapper.exists(ItemLocation))
})

test('render ItemVenue', t => {
  const wrapper = renderWithIntl(<ItemVenue venue='hall' />)
  t.true(wrapper.exists(ItemVenue))
})

test('render ItemDate', t => {
  const wrapper = renderWithIntl(<ItemDate startDate='2020-03-02T12:00:00.000' endDate='2020-04-02T12:00:00.000' />)
  t.true(wrapper.exists(ItemDate))
})
test('render ItemListing', t => {
  const wrapper = renderWithIntl(<ItemListing />)
  t.true(wrapper.exists(ItemListing))
})

test('render duration if the value is 3 hours', t => {
  const wrapper = renderWithIntl(<ItemDuration duration='3 hours' />)
  t.is(wrapper.text(), '⏱Duration:   3 hours')
})

test('render Volunteers per student properly if the value is < 1', t => {
//   t.context.act.volunteers = 0.2
  const equipment = ['a tisket', 'a tasket', 'a little yellow basket']
  const wrapper = renderWithIntl(<ItemNeeds volunteers={0.2} type='act' equipment={equipment} />)
  t.is(wrapper.text(), 'One volunteer for each 5 people')
})
test('render volunteer properly if the value is >= 1', t => {
//   t.context.act.volunteers = 5
  const equipment = ['a tisket', 'a tasket', 'a little yellow basket']

  const wrapper = renderWithIntl(<ItemNeeds volunteers={5} type='act' equipment={equipment} />)
  t.is(wrapper.text(), '🤔Activity needs: 5 people, 3 items')
})
test('render volunteer values === 0 properly', t => {
//   t.context.volunteers = 0
  const wrapper = renderWithIntl(<ItemNeeds volunteers={0} type='act' />)
  t.is(wrapper.text(), '')
})

test('render volunteer values === 0 properly no equipment', t => {
  //   t.context.volunteers = 0
  const equipment = []
  const wrapper = renderWithIntl(<ItemNeeds volunteers={0} equipment={equipment} type='act' />)
  t.is(wrapper.text(), '')
})
