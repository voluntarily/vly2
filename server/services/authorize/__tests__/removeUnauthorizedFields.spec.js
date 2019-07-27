import test from 'ava'
import removeUnauthorizedFields from '../removeUnauthorizedFields'
import { FakeSchema, SchemaName, Fields } from './removeUnauthorizedFields.fixture'
import { AbilityBuilder } from '@casl/ability'
import { Action } from '../../../services/abilities/ability.constants'

test.serial('Only authorized fields returned for single get', async t => {
  const expectedTitle = 'foo'
  const ability = AbilityBuilder.define(can => can(Action.READ, SchemaName, [Fields.TITLE]))
  const data = new FakeSchema({ title: expectedTitle })
  const strippedData = removeUnauthorizedFields(data, FakeSchema, ability, Action.READ)
  t.true(strippedData.hasOwnProperty(Fields.TITLE) && data.title === expectedTitle)
  t.false(strippedData.hasOwnProperty(Fields.SUBTITLE))
})

test.serial('Only authorized fields returned for list get', async t => {
  const expectedTitleA = 'foo'
  const expectedTitleB = 'bar'
  const ability = AbilityBuilder.define(can => can(Action.LIST, SchemaName, [Fields.TITLE]))
  let itemA = new FakeSchema({ title: expectedTitleA })
  let itemB = new FakeSchema({ title: expectedTitleB })
  const data = [itemA, itemB]
  const strippedData = removeUnauthorizedFields(data, FakeSchema, ability, Action.LIST)
  t.is(strippedData.length, 2)
  strippedData.forEach(item => t.true(item.hasOwnProperty(Fields.TITLE)) && t.false(item.hasOwnProperty(Fields.SUBTITLE)))
})
