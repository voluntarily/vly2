const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { accessibleFieldsPlugin } = require('@casl/mongoose')
const { Action } = require('../../../services/abilities/ability.constants')
const schemaName = 'Foo'
const fooSchema = new Schema({
  title: String,
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
  TITLE: 'title',
  SUBTITLE: 'subtitle'
}

const ConvertRequestToAction = (req) => {
  switch (req.method) {
    case 'GET':
      return req.route.path === Routes[Action.READ] ? Action.READ : Action.LIST
    case 'POST':
      return Action.CREATE
    case 'PUT':
      return Action.UPDATE
    case 'DELETE':
      return Action.DELETE
    default:
      return Action.READ
  }
}

module.exports = {
  FakeSchema: mongoose.model(schemaName, fooSchema),
  SchemaName: schemaName,
  Routes,
  Fields,
  ConvertRequestToAction
}
