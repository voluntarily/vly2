import test from 'ava'
import { actionTest } from 'redux-ava'

import {
  ADD_ORG,
  DELETE_ORG,
  ADD_ORGS,
  addOrg,
  deleteOrg,
  addOrgs
} from '../OrgActions'

const org = {
  cuid: 'abc',
  name: 'prank',
  slug: 'first-org',
  about: 'first org',
  type: 'corporate'
}

test('should return the correct type for addOrg', actionTest(
  addOrg,
  org,
  { type: ADD_ORG, org }
))

test('should return the correct type for deleteOrg', actionTest(
  deleteOrg,
  org.cuid,
  { type: DELETE_ORG, cuid: org.cuid }
))

test('should return the correct type for addOrgs', actionTest(
  addOrgs,
  [org],
  { type: ADD_ORGS, orgs: [org] }
))
