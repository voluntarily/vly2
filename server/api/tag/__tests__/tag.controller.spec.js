import test from 'ava'
import { startMongo, stopMongo } from '../../../util/mockMongo'
import { listTags } from '../tag.controller'
import sinon from 'sinon'
import Response from 'mock-express-response'
import Tag from '../tag'

test.before('before connect to database', startMongo)
test.after.always(stopMongo)
test.before('before init db', async (t) => {
  t.context.sandbox = sinon.createSandbox()
})

test.after.always(async (t) => {
  t.context.sandbox.restore()
})

test.serial('list tags should return empty array when there are no tags in DB', async (t) => {
  const fakeResponse = t.context.sandbox.spy(new Response())
  await listTags({}, fakeResponse)

  t.truthy(fakeResponse.json.calledOnce)
  t.deepEqual(fakeResponse.json.getCall(0).args[0], [], 'json should receive empty array')
})

test.serial('list tags should return array of strings when tags exists in DB', async (t) => {
  const tagList = ['test', 'test1', 'test2', 'test3']
  await Tag.create({ tags: tagList })

  const fakeResponse = t.context.sandbox.spy(new Response())
  await listTags({}, fakeResponse)

  t.truthy(fakeResponse.json.calledOnce)
  t.deepEqual(fakeResponse.json.getCall(0).args[0], tagList, 'json should receive tag list')
})

test.serial('error handled appropriately', async (t) => {
  t.context.sandbox.mock(Tag).expects('findOne').throws()
  const fakeResponse = t.context.sandbox.spy(new Response())
  await listTags({}, fakeResponse)

  t.truthy(fakeResponse.status.calledOnce, 'status should have been called')
  t.is(fakeResponse.status.getCall(0).args[0], 500, 'status should have been set to 500')

  t.truthy(fakeResponse.send.called, 'send should have been called')
})
