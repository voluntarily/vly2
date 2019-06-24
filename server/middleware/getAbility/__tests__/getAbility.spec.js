import test from 'ava'
import getAbility from '../getAbility'
import { Action } from '../../../services/abilities/ability.constants'
import { Role } from '../../../services/auth/role'

const DEFAULT_REQ = {
  session: {
    isAuthenticated: true,
    user: {},
    me: {
      role: []
    }
  }
}

const mockNext = () => { }

test.serial('Get ability for anonymous user when no session found', async t => {
  const req = {}
  const res = {}
  getAbility({ searchPattern: '/server/middleware/getAbility/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.true(req.ability.can(Action.READ, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
})

test.serial('Can combine multiple abilities', async t => {
  const req = {}
  const res = {}
  getAbility({ searchPattern: '/server/middleware/getAbility/__tests__/**.fixture.js' })(req, res, mockNext)
  t.true(req.ability.can(Action.READ, 'FOO'))
  t.true(req.ability.can(Action.READ, 'BAR'))
  t.false(req.ability.can(Action.UPDATE, 'FOO'))
  t.false(req.ability.can(Action.UPDATE, 'BAR'))
})

test.serial('Can combine multiple Role', async t => {
  const req = { ...DEFAULT_REQ }
  req.session.me.role.push(Role.VOLUNTEER_PROVIDER)
  req.session.me.role.push(Role.TESTER)
  const res = {}
  getAbility({ searchPattern: '/server/middleware/getAbility/__tests__/getAbility.foo.fixture.js' })(req, res, mockNext)
  t.truthy(req.ability)
  t.true(req.ability.can(Action.UPDATE, 'FOO'))
  t.true(req.ability.can(Action.DELETE, 'FOO'))
  t.false(req.ability.can(Action.MANAGE, 'FOO'))
})
