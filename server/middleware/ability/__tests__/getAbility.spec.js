import test from 'ava'
import getAbility from '../getAbility'
import { Action } from '../../../services/abilities/ability.constants'
import { Role } from '../../../services/authorize/role'

test.beforeEach(t => {
  t.context.REQ_AUTHENTICATED_TEMPLATE = {
    url: '/home',
    session: {
      isAuthenticated: true,
      user: {},
      me: {
        role: []
      },
      idToken: ''
    }
  }
  t.context.REQ_UNAUTHENTICATED_TEMPLATE = {
    url: '/home',
    session: {
      isAuthenticated: false,
      user: null,
      me: null,
      idToken: ''
    }
  }
})
const mockNext = () => { }

test.serial('Get ability for anonymous user when no session found', async t => {
  const req = t.context.REQ_UNAUTHENTICATED_TEMPLATE
  const res = {}
  await getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.true(req.ability.can(Action.READ, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
})

test.serial('Can combine multiple abilities', async t => {
  const req = t.context.REQ_UNAUTHENTICATED_TEMPLATE
  const res = {}
  await getAbility({ searchPattern: '/server/middleware/ability/__tests__/**.fixture.js' })(req, res, mockNext)
  t.true(req.ability.can(Action.READ, 'FOO'))
  t.true(req.ability.can(Action.READ, 'BAR'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'BAR'))
})

test.serial('Default signed in abilities - Volunteer', async t => {
  const req = t.context.REQ_AUTHENTICATED_TEMPLATE
  req.session.me.role.push(Role.VOLUNTEER)
  const res = {}
  await getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.false(req.ability.can(Action.READ, 'FOO'))
  t.false(req.ability.can(Action.LIST, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
  t.true(req.ability.can(Action.DELETE, 'FOO'))
  t.false(req.ability.can(Action.CREATE, 'FOO'))
  t.false(req.ability.can(Action.MANAGE, 'FOO'))
})

test.serial('Can combine multiple Role', async t => {
  const req = t.context.REQ_AUTHENTICATED_TEMPLATE
  req.session.me.role.push(Role.VOLUNTEER)
  req.session.me.role.push(Role.TESTER)
  const res = {}
  await getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.true(req.ability.can(Action.UPDATE, 'FOO'))
  t.true(req.ability.can(Action.DELETE, 'FOO'))
  t.false(req.ability.can(Action.MANAGE, 'FOO'))
})

test.serial('Can get ability for user with invalid role', async t => {
  const req = t.context.REQ_AUTHENTICATED_TEMPLATE
  req.session.me.role.push('ILLEGAL_ROLE')
  const res = {}
  await getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
  t.false(req.ability.can(Action.DELETE, 'FOO'))
  t.false(req.ability.can(Action.MANAGE, 'FOO'))
})
