import test from 'ava'
import { reducerTest } from 'redux-ava'
import orgReducer, { getOrg, getOrgs } from '../OrgReducer'
import { addOrg, deleteOrg, addOrgs } from '../OrgActions'

test('action for ADD_ORG is working', reducerTest(
  orgReducer,
  { data: ['foo'] },
  addOrg({
    name: 'prank',
    about: 'first org',
    type: 'corporate',
    _id: null,
    cuid: null,
    slug: 'first-org'
  }),
  { data: [{
    name: 'prank',
    about: 'first org',
    type: 'corporate',
    _id: null,
    cuid: null,
    slug: 'first-org'
  }, 'foo'] }
))

test('action for DELETE_ORG is working', reducerTest(
  orgReducer,
  { data: [{
    name: 'prank',
    about: 'first org',
    type: 'corporate',
    cuid: 'abc',
    _id: 1,
    slug: 'first-org'
  }] },
  deleteOrg('abc'),
  { data: [] }
))

test('action for ADD_ORGS is working', reducerTest(
  orgReducer,
  { data: [] },
  addOrgs([
    {
      name: 'prank',
      about: 'first org',
      type: 'corporate',
      _id: null,
      cuid: null,
      slug: 'first-org'
    }
  ]),
  { data: [{
    name: 'prank',
    about: 'first org',
    type: 'corporate',
    _id: null,
    cuid: null,
    slug: 'first-org'
  }] }
))

test('getOrgs selector', t => {
  t.deepEqual(
    getOrgs({
      orgs: { data: ['foo'] }
    }),
    ['foo']
  )
})

test('getOrg selector', t => {
  t.deepEqual(
    getOrg({
      orgs: { data: [{ cuid: '123' }] }
    }, '123'),
    { cuid: '123' }
  )
})
