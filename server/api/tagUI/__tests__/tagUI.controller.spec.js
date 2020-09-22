import test from 'ava'
import MemoryMongo from '../../../util/test-memory-mongo'
import { server, appReady } from '../../../server'
import request from 'supertest'
import sinon from 'sinon'
import AliasSet from '../aliasSet'
import { aliases } from './tagUI.fixture'
import { jwtData as jwtAdmin } from '../../../../server/middleware/session/__tests__/setSession.fixture'
import uuid from 'uuid'
import { Role } from '../../../../server/services/authorize/role'
import Person from '../../../../server/api/person/person'
import jsonwebtoken from 'jsonwebtoken'

/**
 * Create a new user with the OrganisationRole.ADMIN role.
 * @param {string[]} roles Array of roles.
 */
const createAdminAndGetToken = async () => {
  // Create a new user in the database directly
  const person = {
    name: 'name',
    email: `${uuid()}@test.com`,
    role: [Role.ADMIN],
    status: 'active'
  }

  await Person.create(person)

  const jwt = { ...jwtAdmin }
  jwt.idTokenPayload.email = person.email

  return jsonwebtoken.sign(jwt.idTokenPayload, 'secret')
}

test.before('before connect to database', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()

  t.context.sandbox = sinon.createSandbox()
  await appReady
})

test.afterEach.always(async (t) => {
  await AliasSet.deleteMany()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test.serial('Return an empty array when there are no aliases in the DB', async (t) => {
  const res = await request(server).get('/api/tagUI').expect(200).expect('Content-Type', /json/)

  t.deepEqual(res.body.length, 0, 'json should receive empty array')
})

test.serial('Return the alias sets that exist in the DB', async (t) => {
  await AliasSet.create(aliases)
  const res = await request(server).get('/api/tagUI').expect(200).expect('Content-Type', /json/)

  t.deepEqual(res.body.length, 3, 'json should receive tag list')
  t.deepEqual(res.body[0].tag, 'coding')
  t.deepEqual(res.body[1].tag, 'development')
  t.deepEqual(res.body[2].tag, 'programming')
})

test.serial('Get all aliases for an existing tag', async (t) => {
  await AliasSet.create(aliases)
  const res = await request(server).get('/api/tagUI/coding').expect(200).expect('Content-Type', /json/)

  t.truthy(res.body.aliases.includes('development'))
  t.false(res.body.aliases.includes('coding'))
})

test.serial('Getting aliases for a non-existing tag returns 404', async (t) => {
  await AliasSet.create(aliases)
  const res = await request(server).get('/api/tagUI/nonexistingTag')

  t.is(res.status, 404)
})

test.serial('Deleting a tag', async t => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/programming').expect(200).expect('Content-Type', /json/)
  await request(server).delete('/api/tagUI/tag/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).expect(200).expect('Content-Type', /json/)

  // The deleted tag does not exist in the alias collection
  await request(server).get('/api/tagUI/programming').expect(404)

  // The deleted tag is removed from aliases of other tags
  const res1 = await request(server).get('/api/tagUI/coding')
  t.false(res1.body.aliases.includes('programming'))
  const res2 = await request(server).get('/api/tagUI/development')
  t.false(res2.body.aliases.includes('programming'))
})

test.serial('Deleting a tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/programming').expect(200).expect('Content-Type', /json/)

  await request(server).delete('/api/tagUI/tag/programming').expect(403)

  // The tag requested for deletion is NOT removed from aliases of other tags
  const res1 = await request(server).get('/api/tagUI/coding')
  t.true(res1.body.aliases.includes('programming'))
  const res2 = await request(server).get('/api/tagUI/development')
  t.true(res2.body.aliases.includes('programming'))
})

test.serial('Deleting a tag alias', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/programming').expect(200).expect('Content-Type', /json/)

  const res1 = await request(server).get('/api/tagUI/programming')
  t.true(res1.body.aliases.includes('coding'))

  // Delete TagB ('coding') from alias set of TagA ('programming')
  await request(server).delete('/api/tagUI/alias/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ aliasToDelete: 'coding' }).expect(200)

  // The deleted alias, TagB, is no longer exists in the alias set of TagA
  const res2 = await request(server).get('/api/tagUI/programming')
  t.false(res2.body.aliases.includes('coding'))

  // Test bi-directional relationship: TagA is no longer in the alias set of TagB
  await request(server).get('/api/tagUI/coding').expect(200).expect('Content-Type', /json/)
  const res3 = await request(server).get('/api/tagUI/coding')
  t.false(res3.body.aliases.includes('programming'))
})

test.serial('Deleting a tag alias, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/programming').expect(200).expect('Content-Type', /json/)

  const res1 = await request(server).get('/api/tagUI/programming')
  t.true(res1.body.aliases.includes('coding'))

  // Make delete call without access - Alias is not removed from tag alias set
  await request(server).delete('/api/tagUI/alias/programming').send({ aliasToDelete: 'coding' }).expect(403)

  // The alias that would be deleted, TagB, is  still in the alias set of TagA
  const res2 = await request(server).get('/api/tagUI/programming')
  t.true(res2.body.aliases.includes('coding'))

  // Test bi-directional relationship: TagA still remains in the alias set of TagB
  await request(server).get('/api/tagUI/coding').expect(200).expect('Content-Type', /json/)
  const res3 = await request(server).get('/api/tagUI/coding')
  t.true(res3.body.aliases.includes('programming'))
})

test.serial('Editting a tag', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/programming').expect(200).expect('Content-Type', /json/)
  await request(server).put('/api/tagUI/tag/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ edittedTag: 'edittedprogramming' }).expect(200)

  // The original tag does not exist in the alias collection
  await request(server).get('/api/tagUI/programming').expect(404)

  // The editted tag does exist in the alias collection
  await request(server).get('/api/tagUI/edittedprogramming').expect(200).expect('Content-Type', /json/)

  // The original tag is removed from aliases of other tags
  const res1 = await request(server).get('/api/tagUI/coding')
  t.false(res1.body.aliases.includes('programming'))

  // The editted tag does exist in the alias collection of other tags
  t.true(res1.body.aliases.includes('edittedprogramming'))
})

test.serial('Editting a tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/programming').expect(200).expect('Content-Type', /json/)

  await request(server).put('/api/tagUI/tag/programming').send({ edittedTag: 'edittedprogramming' }).expect(403)

  // The original tag still exists in the alias collection
  await request(server).get('/api/tagUI/programming').expect(200).expect('Content-Type', /json/)

  // The editted tag does not exist in the alias collection
  await request(server).get('/api/tagUI/edittedprogramming').expect(404)

  // The original tag remains in the aliases of other tags
  const res1 = await request(server).get('/api/tagUI/coding')
  t.true(res1.body.aliases.includes('programming'))

  // The editted tag does exist in the alias collection of other tags
  t.false(res1.body.aliases.includes('edittedprogramming'))
})

test.serial('Adding a tag', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/newtag').expect(404)
  await request(server).post('/api/tagUI/tag/newtag').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).expect(200)

  // The newly added tag is now in the alias collection
  const res = await request(server).get('/api/tagUI/newtag').expect(200).expect('Content-Type', /json/)
  t.is(res.status, 200)
})

test.serial('Adding a tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/tagUI/newtag').expect(404)
  await request(server).post('/api/tagUI/tag/newtag').expect(403)

  // The add request fails and the new tag is not in the alias collection
  const res = await request(server).get('/api/tagUI/newtag').expect(404)
  t.is(res.status, 404)
})

test.serial('Adding an existing tag to the alias list of another tag', async (t) => {
  await AliasSet.create(aliases)
  // Add a new tag (tagB) to the database
  await request(server).get('/api/tagUI/newtag').expect(404)
  await request(server).post('/api/tagUI/tag/newtag').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).expect(200)

  // TagB is now in the alias collection
  await request(server).get('/api/tagUI/newtag').expect(200).expect('Content-Type', /json/)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/tagUI/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // Add tagB to the alias list of tagA
  await request(server).post('/api/tagUI/alias/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ aliasToAdd: 'newtag' }).expect(200)
  // TagB is now an alias of tagA
  const res2 = await request(server).get('/api/tagUI/programming')
  t.true(res2.body.aliases.includes('newtag'))

  // Relationship is bi-directional (tagA is an alias of tagB)
  const res3 = await request(server).get('/api/tagUI/newtag')
  t.true(res3.body.aliases.includes('programming'))
})

test.serial('Adding an existing tag to the alias list of another tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  // Add a new tag (tagB) to the database
  await request(server).get('/api/tagUI/newtag').expect(404)
  await request(server).post('/api/tagUI/tag/newtag').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).expect(200)

  // TagB is now in the alias collection
  await request(server).get('/api/tagUI/newtag').expect(200).expect('Content-Type', /json/)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/tagUI/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // Unauthorised request to add tagB to the alias list of tagA
  await request(server).post('/api/tagUI/alias/programming').send({ aliasToAdd: 'newtag' }).expect(403)

  // TagB is still not in the alias list of tagA
  const res2 = await request(server).get('/api/tagUI/programming')
  t.false(res2.body.aliases.includes('newtag'))

  // Bi-directional check (tagA is also not an alias of tagB)
  const res3 = await request(server).get('/api/tagUI/newtag')
  t.false(res3.body.aliases.includes('programming'))
})

test.serial('Adding a new tag to the alias list of another tag', async (t) => {
  await AliasSet.create(aliases)
  // A new tag (tagB) does not exist in the alias collection
  await request(server).get('/api/tagUI/newtag').expect(404)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/tagUI/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // Add new tag (tagB) to the alias list of tagA
  await request(server).post('/api/tagUI/alias/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ aliasToAdd: 'newtag' }).expect(200)

  // TagB is now an alias of tagA
  const res2 = await request(server).get('/api/tagUI/programming')
  t.true(res2.body.aliases.includes('newtag'))

  // TagB has been added to the alias collection, and tagA is an alias of tagB
  await request(server).get('/api/tagUI/newtag').expect(200).expect('Content-Type', /json/)
  const res3 = await request(server).get('/api/tagUI/newtag')
  t.true(res3.body.aliases.includes('programming'))
})

test.serial('Adding a new tag to the alias list of another tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  // A new tag (tagB) does not exist in the alias collection
  await request(server).get('/api/tagUI/newtag').expect(404)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/tagUI/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // Unauthorised request to add new tag (tagB) to the alias list of tagA
  await request(server).post('/api/tagUI/alias/programming').send({ aliasToAdd: 'newtag' }).expect(403)

  // TagB is still not an alias of tagA
  const res2 = await request(server).get('/api/tagUI/programming')
  t.false(res2.body.aliases.includes('newtag'))

  // TagB has not been added to the alias collection
  await request(server).get('/api/tagUI/newtag').expect(404)
})
