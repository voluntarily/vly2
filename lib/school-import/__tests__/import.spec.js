import fs from 'fs'
import importSchools from '../import'
import MemoryMongo from '../../../server/util/test-memory-mongo'
import path from 'path'
import SchoolLookUp from '../../../server/api/school-lookup/school-lookup'
import test from 'ava'
const { fetchMock } = require('fetch-mock')

test.before('start in memory mongo and create fake server', async (t) => {
  t.context.memMongo = new MemoryMongo()
  await t.context.memMongo.start()
})

test.after.always(async (t) => {
  await t.context.memMongo.stop()
})

test('import script works', async (t) => {
  const baseUrl = 'https://catalogue.data.govt.nz/' +
    'api/3/action/datastore_search?resource_id=bdfe0e4c-1554-4701-a8fe-ba1c8e0cc2ce&sort=Org_Name'

  const firstRequestUrl = `${baseUrl}&offset=0&limit=10`
  const secondRequestUrl = `${baseUrl}&offset=10&limit=10`

  fetchMock.mock(firstRequestUrl, fs.readFileSync(path.resolve(__dirname, 'data', 'request-one-mock.json')).toString())
  fetchMock.mock(secondRequestUrl, fs.readFileSync(path.resolve(__dirname, 'data', 'request-two-mock.json')).toString())

  const originalConsoleLog = console.log
  console.log = () => {}
  await importSchools(10)
  console.log = originalConsoleLog

  t.is(await SchoolLookUp.countDocuments(), 5)
})
