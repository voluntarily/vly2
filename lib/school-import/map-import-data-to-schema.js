const getDomainFromEmail = require('./get-domain-from-email')

const parseAddress = (line1, suburb, city) => {
  const addressParts = [line1, suburb, city]
  return addressParts.filter((part) => part !== '').join('\n')
}

const mapImportDataToSchema = (importDataRecord) => {
  return {
    schoolId: importDataRecord.School_Id,
    name: importDataRecord.Org_Name,
    telephone: importDataRecord.Telephone,
    contactName: importDataRecord.Contact1_Name,
    emailDomain: getDomainFromEmail(importDataRecord.Email),
    website: importDataRecord.URL,
    address: parseAddress(importDataRecord.Add1_Line1, importDataRecord.Add1_Suburb, importDataRecord.Add1_City),
    schoolType: importDataRecord.Org_Type,
    decile: importDataRecord.Decile
  }
}

module.exports = mapImportDataToSchema
