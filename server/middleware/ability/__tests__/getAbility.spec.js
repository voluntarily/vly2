import test from 'ava'
import getAbility from '../getAbility'
import { Action } from '../../../services/abilities/ability.constants'
import { Role } from '../../../services/auth/role'

test.beforeEach(t => {
  t.context.DEFAULT_REQ = {
    session: {
      isAuthenticated: true,
      user: {},
      me: {
        role: []
      }
    }
  }
})
const mockNext = () => { }

test.serial('Get ability for anonymous user when no session found', async t => {
  const req = {}
  const res = {}
  getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.true(req.ability.can(Action.READ, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
})

test.serial('Can combine multiple abilities', async t => {
  const req = {}
  const res = {}
  getAbility({ searchPattern: '/server/middleware/ability/__tests__/**.fixture.js' })(req, res, mockNext)
  t.true(req.ability.can(Action.READ, 'FOO'))
  t.true(req.ability.can(Action.READ, 'BAR'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'BAR'))
})

test.serial('Default signed in abilities - Volunteer', async t => {
  const req = t.context.DEFAULT_REQ
  req.session.me.role.push(Role.VOLUNTEER_PROVIDER)
  const res = {}
  getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.false(req.ability.can(Action.READ, 'FOO'))
  t.false(req.ability.can(Action.LIST, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
  t.true(req.ability.can(Action.DELETE, 'FOO'))
  t.false(req.ability.can(Action.CREATE, 'FOO'))
  t.false(req.ability.can(Action.MANAGE, 'FOO'))
})

test.serial('Can combine multiple Role', async t => {
  const req = t.context.DEFAULT_REQ
  req.session.me.role.push(Role.VOLUNTEER_PROVIDER)
  req.session.me.role.push(Role.TESTER)
  const res = {}
  getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.true(req.ability.can(Action.UPDATE, 'FOO'))
  t.true(req.ability.can(Action.DELETE, 'FOO'))
  t.false(req.ability.can(Action.MANAGE, 'FOO'))
})

test.serial('Can get ability for user with invalid role', async t => {
  const req = t.context.DEFAULT_REQ
  req.session.me.role.push('ILLEGAL_ROLE')
  const res = {}
  getAbility({ searchPattern: '/server/middleware/ability/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
  t.false(req.ability.can(Action.DELETE, 'FOO'))
  t.false(req.ability.can(Action.MANAGE, 'FOO'))
})
