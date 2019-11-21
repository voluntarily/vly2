/* global fetch */
require('isomorphic-fetch')
const filterValidSchoolRecords = require('../../lib/school-import/filter-valid-school-records')
const mapImportDataToSchema = require('../../lib/school-import/map-import-data-to-schema')
const SchoolLookUp = require('../../server/api/school-lookup/school-lookup')

const importSchools = async (limit) => {
  const apiBaseUrl = 'https://catalogue.data.govt.nz' +
    '/api/3/action/datastore_search' +
    '?resource_id=bdfe0e4c-1554-4701-a8fe-ba1c8e0cc2ce&sort=Org_Name'

  let total = 0
  let offset = 0

  let insertCount = 0

  do {
    const requestUrl = `${apiBaseUrl}&offset=${offset}&limit=${limit}`
    const response = await fetch(requestUrl)

    const responseJson = await response.json()

    if (total === 0) {
      total = responseJson.result.total
    }

    offset += limit

    const records = responseJson.result.records

    const mappedSchoolRecords = []

    for (const record of records) {
      // convert record to data that matches our schema
      const schoolLookUpRecord = mapImportDataToSchema(record)
      mappedSchoolRecords.push(schoolLookUpRecord)
    }

    const validSchoolRecords = filterValidSchoolRecords(mappedSchoolRecords)

    await SchoolLookUp.insertMany(validSchoolRecords)

    insertCount += validSchoolRecords.length
    console.log(`Inserted ${insertCount} schools`)
  } while (offset <= total)
}

module.exports = importSchools
