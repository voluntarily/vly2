import test from 'ava'
import mapImportDataToSchema from '../map-import-data-to-schema'
import { SCHOOL_TYPES } from '../../../server/api/school-lookup/school-lookup.constants'

test('map import data', async (t) => {
  const importDataRecord = {
    _id: 1,
    School_Id: 1,
    Org_Name: 'Test School',
    Telephone: '123 456 789',
    Fax: '123 456 987',
    Email: 'test@example.school.nz',
    Contact1_Name: 'Test Contact Person',
    URL: 'https://www.example.school.nz',
    Add1_Line1: '1 Test Rd',
    Add1_Suburb: 'Testurb',
    Add1_City: 'Testington',
    Add2_Line1: 'P O Box 12345',
    Add2_Suburb: 'Testurb',
    Add2_City: 'Testington',
    Add2_Postal_Code: '1234',
    Urban_Area: 'Main Urban Area',
    Org_Type: 'Full Primary',
    Definition: 'Not Applicable',
    Authority: 'Private : Provisionally Registered',
    CoEd_Status: 'Co-Educational',
    Territorial_Authority: 'Testington',
    Regional_Council: 'Testington Region',
    Local_Office_Name: 'Testington',
    Education_Region: 'Testington',
    General_Electorate: 'Testurb',
    Māori_Electorate: 'Tēhi',
    Area_Unit: 'Test',
    Ward: 'Test Ward',
    Col_Id: null,
    Col_Name: '',
    Latitude: null,
    Longitude: null,
    Decile: 5,
    Roll_Date: '2019-10-01T00:00:00',
    Total: 700,
    European: 100,
    Māori: 100,
    Pacific: 100,
    Asian: 100,
    MELAA: 100,
    Other: 100,
    International: 100
  }

  const expectedSchemaDataRecord = {
    schoolId: 1,
    name: 'Test School',
    telephone: '123 456 789',
    emailDomain: 'example.school.nz',
    contactName: 'Test Contact Person',
    website: 'https://www.example.school.nz',
    address: '1 Test Rd\nTesturb\nTestington',
    schoolType: SCHOOL_TYPES.FULL_PRIMARY,
    decile: 5
  }

  const actualSchemaDataRecord = mapImportDataToSchema(importDataRecord)

  t.deepEqual(actualSchemaDataRecord, expectedSchemaDataRecord)
})
