import test from 'ava'
import { authorizeActions, defaultConvertRequestToAction } from '../authorizeRequest'
import { SchemaName, Routes, ConvertRequestToAction } from './authorizeRequest.fixture'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { defineAbility } from '@casl/ability'
import { Action } from '../../../services/abilities/ability.constants'
import sinon from 'sinon'

test.serial('Request rejected if unauthorized', async t => {
  const request = new MockExpressRequest({
    method: 'DELETE',
    route: {
      path: Routes[Action.DELETE]
    }
  })
  const abilityForUnauthorizedRequest = defineAbility((can, cannot) => {
    can(Action.READ, SchemaName)
    cannot(Action.DELETE, SchemaName)
  })
  request.ability = abilityForUnauthorizedRequest
  const response = new MockExpressResponse({ request })
  const next = sinon.fake()
  authorizeActions(SchemaName)(request, response, next)
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
  const abilityForAuthorizedRequest = defineAbility(can => {
    can(Action.READ, SchemaName)
    can(Action.LIST, SchemaName)
  })
  request.ability = abilityForAuthorizedRequest
  const response = new MockExpressResponse({ request })
  const next = sinon.fake()
  authorizeActions(SchemaName)(request, response, next)
  t.is(next.callCount, 1)
})

test.serial('can provide custom action mapper', async t => {
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: Routes[Action.LIST]
    }
  })
  const abilityForAuthorizedRequest = defineAbility((can, cannot) => {
    can(Action.LIST, SchemaName)
    cannot(Action.READ, SchemaName)
  })
  request.ability = abilityForAuthorizedRequest
  const response = new MockExpressResponse({ request })
  const next = sinon.fake()
  authorizeActions(SchemaName, ConvertRequestToAction)(request, response, next)
  t.is(next.callCount, 1)
})

test.serial('Default request action mapper can handle GET', async t => {
  const request = new MockExpressRequest({
    method: 'GET'
  })
  t.is(defaultConvertRequestToAction(request), Action.READ)
})

test.serial('Default request action mapper can handle POST', async t => {
  const request = new MockExpressRequest({
    method: 'POST'
  })
  t.is(defaultConvertRequestToAction(request), Action.CREATE)
})

test.serial('Default request action mapper can handle PUT', async t => {
  const request = new MockExpressRequest({
    method: 'PUT'
  })
  t.is(defaultConvertRequestToAction(request), Action.UPDATE)
})

test.serial('Default request action mapper can handle DELETE', async t => {
  const request = new MockExpressRequest({
    method: 'DELETE'
  })
  t.is(defaultConvertRequestToAction(request), Action.DELETE)
})

test.serial('Default request action mapper defaults to READ when unexpected method received', async t => {
  const request = new MockExpressRequest({
    method: 'PATCH'
  })
  t.is(defaultConvertRequestToAction(request), Action.READ)
})
