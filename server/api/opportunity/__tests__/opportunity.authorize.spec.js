import test from 'ava'
import { authorizeOpportunityActions, authorizeOpportunityFields } from '../opportunity.authorize'
import { Subject, OpportunityRoutes } from '../opportunity.constants'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import { AbilityBuilder } from '@casl/ability'
import { Action } from '../../../services/abilities/ability.constants'
import sinon from 'sinon'
import Opportunity from '../opportunity'

test.serial('Opportunity request rejected if unauthorized', async t => {
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: OpportunityRoutes[Action.LIST]
    }
  })
  const abilityForUnauthorizedRequest = AbilityBuilder.define((can, cannot) => {
    can(Action.READ, Subject)
    cannot(Action.LIST, Subject)
  })
  request.ability = abilityForUnauthorizedRequest
  const response = new MockExpressResponse({ request })
  const next = sinon.fake()
  authorizeOpportunityActions(request, response, next)
  t.is(response.statusCode, 403)
  t.is(next.callCount, 0)
})

test.serial('Opportunity request accepted if authorized', async t => {
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: OpportunityRoutes[Action.LIST]
    }
  })
  const abilityForAuthorizedRequest = AbilityBuilder.define(can => {
    can(Action.READ, Subject)
    can(Action.LIST, Subject)
  })
  request.ability = abilityForAuthorizedRequest
  const response = new MockExpressResponse({ request })
  const next = sinon.fake()
  authorizeOpportunityActions(request, response, next)
  t.is(next.callCount, 1)
})

test.serial('Only authorized Opportunity fields returned for single get', async t => {
  const expectedTitle = 'foo'
  const ability = AbilityBuilder.define(can => can(Action.READ, Subject, ['title']))
  let opportunity = new Opportunity()
  opportunity.title = expectedTitle
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: OpportunityRoutes[Action.READ]
    }
  })
  request.ability = ability
  const response = new MockExpressResponse({ request })
  response.body = opportunity
  const next = sinon.fake()
  authorizeOpportunityFields(request, response, next)
  t.is(response.body.title, expectedTitle)
  t.false(!!response.body.subtitle)
  t.is(next.callCount, 1)
})

test.serial('Only authorized Opportunity fields returned for list get', async t => {
  const expectedTitleA = 'foo'
  const expectedTitleB = 'bar'
  const ability = AbilityBuilder.define(can => can(Action.READ, Subject, ['title']))
  let opportunityA = new Opportunity()
  opportunityA.title = expectedTitleA
  let opportunityB = new Opportunity()
  opportunityB.title = expectedTitleB
  const request = new MockExpressRequest({
    method: 'GET',
    route: {
      path: OpportunityRoutes[Action.LIST]
    }
  })
  request.ability = ability
  const response = new MockExpressResponse({ request })
  response.body = [opportunityA, opportunityB]
  const next = sinon.fake()
  authorizeOpportunityFields(request, response, next)
  t.is(response.body.length, 2)
  response.body.forEach(opp => t.true(!!opp.title) && t.false(!!opp.subtitle))
  t.is(next.callCount, 1)
})
