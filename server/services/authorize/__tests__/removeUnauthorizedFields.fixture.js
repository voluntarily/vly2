const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { accessibleFieldsPlugin } = require('@casl/mongoose')
const schemaName = 'Foo'
const fooSchema = new Schema({
  title: String,
  subtitle: String
})

fooSchema.plugin(accessibleFieldsPlugin)

const Fields = {
  ID: '_id',
  TITLE: 'title',
  SUBTITLE: 'subtitle'
}

module.exports = {
  FakeSchema: mongoose.model(schemaName, fooSchema),
  SchemaName: schemaName,
  Fields
}
