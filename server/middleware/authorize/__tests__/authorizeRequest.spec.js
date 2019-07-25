import test from 'ava'
import { authorizeActions, authorizeFields } from '../authorizeRequest'
import { FakeSchema, SchemaName, Routes, Fields, ConvertRequestToAction } from './authorizeRequest.fixture'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { AbilityBuilder } from '@casl/ability'
import { Action } from '../../../services/abilities/ability.constants'
import sinon from 'sinon'

test.serial('Request rejected if unauthorized', async t => {
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: Routes[Action.LIST]
    }
  })
  const abilityForUnauthorizedRequest = AbilityBuilder.define((can, cannot) => {
    can(Action.READ, SchemaName)
    cannot(Action.LIST, SchemaName)
  })
  request.ability = abilityForUnauthorizedRequest
  const response = new MockExpressResponse({ request })
  const next = sinon.fake()
  authorizeActions(SchemaName, ConvertRequestToAction)(request, response, next)
  t.is(response.statusCode, 403)
  t.is(next.callCount, 0)
})

test.serial('Request accepted if authorized', async t => {
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: Routes[Action.LIST]
    }
  })
  const abilityForAuthorizedRequest = AbilityBuilder.define(can => {
    can(Action.READ, SchemaName)
    can(Action.LIST, SchemaName)
  })
  request.ability = abilityForAuthorizedRequest
  const response = new MockExpressResponse({ request })
  const next = sinon.fake()
  authorizeActions(SchemaName, ConvertRequestToAction)(request, response, next)
  t.is(next.callCount, 1)
})

test.serial('Only authorized fields returned for single get', async t => {
  const expectedTitle = 'foo'
  const ability = AbilityBuilder.define(can => can(Action.READ, SchemaName, [Fields.TITLE]))
  let item = new FakeSchema()
  item.title = expectedTitle
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: Routes[Action.READ]
    }
  })
  request.ability = ability
  const response = new MockExpressResponse({ request })
  response.body = item
  const next = sinon.fake()
  authorizeFields(FakeSchema)(request, response, next)
  t.is(response.body.title, expectedTitle)
  t.false(!!response.body.subtitle)
  t.is(next.callCount, 1)
})

test.serial('Only authorized fields returned for list get', async t => {
  const propA = 'foo'
  const propB = 'bar'
  const ability = AbilityBuilder.define(can => can(Action.READ, SchemaName, [Fields.TITLE]))
  let itemA = new FakeSchema()
  itemA.title = propA
  let itemB = new FakeSchema()
  itemB.title = propB
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: Routes[Action.LIST]
    }
  })
  request.ability = ability
  const response = new MockExpressResponse({ request })
  response.body = [itemA, itemB]
  const next = sinon.fake()
  authorizeFields(FakeSchema)(request, response, next)
  t.is(response.body.length, 2)
  response.body.forEach(item => t.true(!!item.title) && t.false(!!item.subtitle))
  t.is(next.callCount, 1)
})
