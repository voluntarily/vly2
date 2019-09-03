const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { accessibleFieldsPlugin } = require('@casl/mongoose')
const { Action } = require('../../../services/abilities/ability.constants')
const schemaName = 'Foo'
const fooSchema = new Schema({
  name: String,
  subtitle: String
})

fooSchema.plugin(accessibleFieldsPlugin)

const Routes = {
  [Action.LIST]: '/foo',
  [Action.READ]: '/foo/:id',
  [Action.UPDATE]: '/foo/:id/edit',
  [Action.CREATE]: '/foo/new'
}

const Fields = {
  ID: '_id',
  NAME: 'name',
  SUBTITLE: 'subtitle'
}

const ConvertRequestToAction = (req) => {
  return Action.LIST
}

module.exports = {
  FakeSchema: mongoose.model(schemaName, fooSchema),
  SchemaName: schemaName,
  Routes,
  Fields,
  ConvertRequestToAction
}
