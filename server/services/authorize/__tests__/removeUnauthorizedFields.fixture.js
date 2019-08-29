const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { accessibleFieldsPlugin } = require('@casl/mongoose')
const schemaName = 'Foo'
const fooSchema = new Schema({
  name: String,
  subtitle: String
})

fooSchema.plugin(accessibleFieldsPlugin)

const Fields = {
  ID: '_id',
  NAME: 'name',
  SUBTITLE: 'subtitle'
}

module.exports = {
  FakeSchema: mongoose.model(schemaName, fooSchema),
  SchemaName: schemaName,
  Fields
}
