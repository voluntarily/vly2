import test from 'ava'
import sinon from 'sinon'
import removeUnauthorizedFields from '../removeUnauthorizedFields'
import { FakeSchema, SchemaName, Fields } from './removeUnauthorizedFields.fixture'
import { AbilityBuilder } from '@casl/ability'
import { Action } from '../../../services/abilities/ability.constants'

test.serial('Only authorized fields returned for single get', async t => {
  const expectedTitle = 'foo'
  const nextMiddleware = sinon.fake()
  const mockDataObject = {
    name: expectedTitle,
    subtitle: 'This should be filtered out'
  }
  const ability = AbilityBuilder.define(can => can(Action.READ, SchemaName, [Fields.NAME]))

  const mockRequestObject = {
    ability: ability,
    method: 'GET',
    crudify: {
      result: mockDataObject
    }
  }

  removeUnauthorizedFields(FakeSchema)(mockRequestObject, {}, nextMiddleware)
  t.assert(nextMiddleware.called)
  t.is(Object.keys(mockRequestObject.crudify.result).length, 1)
  t.is(mockRequestObject.crudify.result.name, expectedTitle)
})

test.failing('Only authorized fields returned for list get', async t => {
  const expectedTitleA = 'foo'
  const expectedTitleB = 'bar'
  const nextMiddleware = sinon.fake()
  const mongooseCrudifyResult = [{
    name: expectedTitleA,
    subtitle: 'This subtitle will be filtered out'
  }, {
    name: expectedTitleB,
    subtitle: 'This subtitle will be filtered out'
  }]
  const ability = AbilityBuilder.define(can => can(Action.READ, SchemaName, [Fields.NAME]))
  const mockRequestObject = {
    method: 'GET',
    ability: ability,
    crudify: {
      result: mongooseCrudifyResult
    }
  }

  removeUnauthorizedFields(FakeSchema)(mockRequestObject, {}, nextMiddleware)
  t.assert(nextMiddleware.called)
  t.assert(Array.isArray(mockRequestObject.crudify.result))
  mockRequestObject.crudify.result.forEach(
    item => t.true(Object.prototype.hasOwnProperty.call(item, Fields.NAME)) &&
    t.false(Object.prototype.hasOwnProperty.call(item, Fields.SUBTITLE))
  )
})
