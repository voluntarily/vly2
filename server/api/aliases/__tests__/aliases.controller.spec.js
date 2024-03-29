import test from 'ava'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { server, appReady } from '../../../server'
import request from 'supertest'
import sinon from 'sinon'
import AliasSet from '../aliasSet'
import { aliases } from './aliases.fixture'
import { jwtData as jwtAdmin } from '../../../middleware/session/__tests__/setSession.fixture'
import { v4 as uuid } from 'uuid'
import { Role } from '../../../services/authorize/role'
import Person from '../../person/person'
import jsonwebtoken from 'jsonwebtoken'
import Tag from './../../tag/tag'

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

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  t.context.sandbox = sinon.createSandbox()
  await appReady
})

test.afterEach.always(async (t) => {
  await AliasSet.deleteMany()
  await Tag.deleteMany()
})

test.serial('Return an empty array when there are no aliases in the DB', async (t) => {
  const res = await request(server).get('/api/aliases').expect(200).expect('Content-Type', /json/)

  t.deepEqual(res.body.length, 0, 'json should receive empty array')
})

test.serial('Return the alias sets that exist in the DB', async (t) => {
  await AliasSet.create(aliases)
  const res = await request(server).get('/api/aliases').expect(200).expect('Content-Type', /json/)

  t.deepEqual(res.body.length, 3, 'json should receive tag list')
  t.deepEqual(res.body[0].tag, 'coding')
  t.deepEqual(res.body[1].tag, 'development')
  t.deepEqual(res.body[2].tag, 'programming')
})

test.serial('Get all aliases for an existing tag', async (t) => {
  await AliasSet.create(aliases)
  const res = await request(server).get('/api/aliases/coding').expect(200).expect('Content-Type', /json/)

  t.truthy(res.body.aliases.includes('development'))
  t.false(res.body.aliases.includes('coding'))
})

test.serial('Getting aliases for a non-existing tag returns 404', async (t) => {
  await AliasSet.create(aliases)
  const res = await request(server).get('/api/aliases/nonexistingTag')

  t.is(res.status, 404)
})

test.serial('Deleting a tag', async t => {
  await AliasSet.create(aliases)
  const tagList = ['test', 'programming', 'test2', 'test3']
  await Tag.create({ tags: tagList })

  // Check tag is in alias collection
  await request(server).get('/api/aliases/programming').expect(200).expect('Content-Type', /json/)
  // Check tag is in taglist collection
  const res1 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.true(res1.body.includes('programming'))

  await request(server).delete('/api/aliases/tag/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).expect(200).expect('Content-Type', /json/)

  // The deleted tag does not exist in the alias collection
  await request(server).get('/api/aliases/programming').expect(404)

  // The deleted tag is removed from aliases of other tags
  const res2 = await request(server).get('/api/aliases/coding')
  t.false(res2.body.aliases.includes('programming'))
  const res3 = await request(server).get('/api/aliases/development')
  t.false(res3.body.aliases.includes('programming'))

  // The original tag does not exist in the taglist collection
  const res4 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.false(res4.body.includes('programming'))
})

test.serial('Deleting a tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/aliases/programming').expect(200).expect('Content-Type', /json/)

  await request(server).delete('/api/aliases/tag/programming').expect(403)

  // The tag requested for deletion is NOT removed from aliases of other tags
  const res1 = await request(server).get('/api/aliases/coding')
  t.true(res1.body.aliases.includes('programming'))
  const res2 = await request(server).get('/api/aliases/development')
  t.true(res2.body.aliases.includes('programming'))
})

test.serial('Deleting a tag alias', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/aliases/programming').expect(200).expect('Content-Type', /json/)

  const res1 = await request(server).get('/api/aliases/programming')
  t.true(res1.body.aliases.includes('coding'))

  // Delete TagB ('coding') from alias set of TagA ('programming')
  await request(server).delete('/api/aliases/alias/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ aliasToDelete: 'coding' }).expect(200)

  // The deleted alias, TagB, is no longer exists in the alias set of TagA
  const res2 = await request(server).get('/api/aliases/programming')
  t.false(res2.body.aliases.includes('coding'))

  // Test bi-directional relationship: TagA is no longer in the alias set of TagB
  await request(server).get('/api/aliases/coding').expect(200).expect('Content-Type', /json/)
  const res3 = await request(server).get('/api/aliases/coding')
  t.false(res3.body.aliases.includes('programming'))
})

test.serial('Deleting a tag alias, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/aliases/programming').expect(200).expect('Content-Type', /json/)

  const res1 = await request(server).get('/api/aliases/programming')
  t.true(res1.body.aliases.includes('coding'))

  // Make delete call without access - Alias is not removed from tag alias set
  await request(server).delete('/api/aliases/alias/programming').send({ aliasToDelete: 'coding' }).expect(403)

  // The alias that would be deleted, TagB, is  still in the alias set of TagA
  const res2 = await request(server).get('/api/aliases/programming')
  t.true(res2.body.aliases.includes('coding'))

  // Test bi-directional relationship: TagA still remains in the alias set of TagB
  await request(server).get('/api/aliases/coding').expect(200).expect('Content-Type', /json/)
  const res3 = await request(server).get('/api/aliases/coding')
  t.true(res3.body.aliases.includes('programming'))
})

test.serial('Editting a tag', async (t) => {
  await AliasSet.create(aliases)

  const tagList = ['test', 'programming', 'test2', 'test3']
  await Tag.create({ tags: tagList })

  // Check that tag is in alias collection
  await request(server).get('/api/aliases/programming').expect(200).expect('Content-Type', /json/)

  // Check that tag is in taglist collection
  const res1 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.true(res1.body.includes('programming'))

  await request(server).put('/api/aliases/tag/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ edittedTag: 'edittedprogramming' }).expect(200)

  // The original tag is removed from the alias collection
  await request(server).get('/api/aliases/programming').expect(404)

  // The editted tag does exist in the alias collection
  await request(server).get('/api/aliases/edittedprogramming').expect(200).expect('Content-Type', /json/)

  // The original tag is removed from aliases of other tags
  const res2 = await request(server).get('/api/aliases/coding')
  t.false(res2.body.aliases.includes('programming'))

  // The editted tag does exist in the alias collection of other tags
  t.true(res2.body.aliases.includes('edittedprogramming'))

  // The original tag does not exist in the taglist collection
  const res3 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.false(res3.body.includes('programming'))

  // The editted tag does exist in the taglist collection
  t.true(res3.body.includes('edittedprogramming'))
})

test.serial('Editting a tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/aliases/programming').expect(200).expect('Content-Type', /json/)

  await request(server).put('/api/aliases/tag/programming').send({ edittedTag: 'edittedprogramming' }).expect(403)

  // The original tag still exists in the alias collection
  await request(server).get('/api/aliases/programming').expect(200).expect('Content-Type', /json/)

  // The editted tag does not exist in the alias collection
  await request(server).get('/api/aliases/edittedprogramming').expect(404)

  // The original tag remains in the aliases of other tags
  const res1 = await request(server).get('/api/aliases/coding')
  t.true(res1.body.aliases.includes('programming'))

  // The editted tag does exist in the alias collection of other tags
  t.false(res1.body.aliases.includes('edittedprogramming'))
})

test.serial('Adding a tag', async (t) => {
  await AliasSet.create(aliases)
  const tagList = ['test', 'programming', 'test2', 'test3']
  await Tag.create({ tags: tagList })
  // Tag is not in alias collection
  await request(server).get('/api/aliases/newtag').expect(404)

  // Tag is not in taglist collection
  const res1 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.false(res1.body.includes('newtag'))

  await request(server).post('/api/aliases/tag/newtag').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ tags: ['newtag'] }).expect(200)
  // The newly added tag is now in the alias collection
  const res2 = await request(server).get('/api/aliases/newtag').expect(200).expect('Content-Type', /json/)
  t.is(res2.status, 200)

  // The newly added tag is now in the taglist collection
  const res3 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.true(res3.body.includes('newtag'))
})

test.serial('Adding a tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  await request(server).get('/api/aliases/newtag').expect(404)
  await request(server).post('/api/aliases/tag/newtag').expect(403)

  // The add request fails and the new tag is not in the alias collection
  const res = await request(server).get('/api/aliases/newtag').expect(404)
  t.is(res.status, 404)
})

test.serial('Adding an existing tag to the alias list of another tag', async (t) => {
  await AliasSet.create(aliases)
  // Add a new tag (tagB) to the database
  await request(server).get('/api/aliases/newtag').expect(404)
  await request(server).post('/api/aliases/tag/newtag').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).expect(200)

  // TagB is now in the alias collection
  await request(server).get('/api/aliases/newtag').expect(200).expect('Content-Type', /json/)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/aliases/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // Add tagB to the alias list of tagA
  await request(server).post('/api/aliases/alias/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ aliasToAdd: 'newtag' }).expect(200)
  // TagB is now an alias of tagA
  const res2 = await request(server).get('/api/aliases/programming')
  t.true(res2.body.aliases.includes('newtag'))

  // Relationship is bi-directional (tagA is an alias of tagB)
  const res3 = await request(server).get('/api/aliases/newtag')
  t.true(res3.body.aliases.includes('programming'))
})

test.serial('Adding an existing tag to the alias list of another tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  // Add a new tag (tagB) to the database
  await request(server).get('/api/aliases/newtag').expect(404)
  await request(server).post('/api/aliases/tag/newtag').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).expect(200)

  // TagB is now in the alias collection
  await request(server).get('/api/aliases/newtag').expect(200).expect('Content-Type', /json/)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/aliases/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // Unauthorised request to add tagB to the alias list of tagA
  await request(server).post('/api/aliases/alias/programming').send({ aliasToAdd: 'newtag' }).expect(403)

  // TagB is still not in the alias list of tagA
  const res2 = await request(server).get('/api/aliases/programming')
  t.false(res2.body.aliases.includes('newtag'))

  // Bi-directional check (tagA is also not an alias of tagB)
  const res3 = await request(server).get('/api/aliases/newtag')
  t.false(res3.body.aliases.includes('programming'))
})

test.serial('Adding a new tag to the alias list of another tag', async (t) => {
  await AliasSet.create(aliases)
  const tagList = ['test', 'programming', 'test2', 'test3']
  await Tag.create({ tags: tagList })

  // A new tag (tagB) does not exist in the alias collection
  await request(server).get('/api/aliases/newtag').expect(404)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/aliases/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // TagB is also not in taglist collection
  const res2 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.false(res2.body.includes('newtag'))

  // Add new tag (tagB) to the alias list of tagA
  await request(server).post('/api/aliases/alias/programming').set('Cookie', [`idToken=${await createAdminAndGetToken()}`]).send({ aliasToAdd: 'newtag', tags: ['newtag'] }).expect(200)

  // TagB is now an alias of tagA
  const res3 = await request(server).get('/api/aliases/programming')
  t.true(res3.body.aliases.includes('newtag'))

  // TagB has been added to the alias collection, and tagA is an alias of tagB
  await request(server).get('/api/aliases/newtag').expect(200).expect('Content-Type', /json/)
  const res4 = await request(server).get('/api/aliases/newtag')
  t.true(res4.body.aliases.includes('programming'))

  // The newly added tag is also now in the taglist collection
  const res5 = await request(server).get('/api/tags').expect(200).expect('Content-Type', /json/)
  t.true(res5.body.includes('newtag'))
})

test.serial('Adding a new tag to the alias list of another tag, non-admin request', async (t) => {
  await AliasSet.create(aliases)
  // A new tag (tagB) does not exist in the alias collection
  await request(server).get('/api/aliases/newtag').expect(404)

  // TagB is not yet in the alias list of another tag (tagA)
  const res1 = await request(server).get('/api/aliases/programming')
  t.false(res1.body.aliases.includes('newtag'))

  // Unauthorised request to add new tag (tagB) to the alias list of tagA
  await request(server).post('/api/aliases/alias/programming').send({ aliasToAdd: 'newtag' }).expect(403)

  // TagB is still not an alias of tagA
  const res2 = await request(server).get('/api/aliases/programming')
  t.false(res2.body.aliases.includes('newtag'))

  // TagB has not been added to the alias collection
  await request(server).get('/api/aliases/newtag').expect(404)
})
