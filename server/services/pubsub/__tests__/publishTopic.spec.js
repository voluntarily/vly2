import test from 'ava'
import sinon from 'sinon'
import { publishCreate } from '../publishTopic'
import objectid from 'objectid'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const PubSub = require('pubsub-js')

// create a mock schema
const schemaName = 'Foo'
const fooSchema = new Schema({
  name: String,
  subtitle: String
})
const FakeModel = mongoose.model(schemaName, fooSchema)
const TOPIC_FOO__CREATE = Symbol('FOO.CREATE')

test.serial('publish new Topic based on schema name - Single', async t => {
  const next = sinon.spy()
  // subscribe to published new person messages
  const spy = sinon.spy()
  const clock = sinon.useFakeTimers()
  PubSub.subscribe(TOPIC_FOO__CREATE, spy)

  const newFoo = {
    _id: objectid(),
    name: 'name',
    subtitle: 'subtitle'
  }

  const req = {
    method: 'POST',
    crudify: {
      result: newFoo
    }
  }
  publishCreate(FakeModel)(req, {}, next)
  t.assert(next.called)
  // confirm message published, sub called
  t.is(spy.callCount, 0)
  clock.tick(1)
  t.is(spy.callCount, 1)
  clock.restore()
})

test.serial('publish new Topic based on schema name - Array', async t => {
  const next = sinon.spy()
  // subscribe to published new person messages
  const spy = sinon.spy()
  const clock = sinon.useFakeTimers()
  PubSub.subscribe(TOPIC_FOO__CREATE, spy)

  const newFoos = [{
    _id: objectid(),
    name: 'name 1',
    subtitle: 'subtitle 1'
  },
  {
    _id: objectid(),
    name: 'name 2',
    subtitle: 'subtitle 2'
  }]

  const req = {
    method: 'POST',
    crudify: {
      result: newFoos
    }
  }
  publishCreate(FakeModel)(req, {}, next)
  t.assert(next.called)
  // confirm message published, sub called
  t.is(spy.callCount, 0)
  clock.tick(1)
  t.is(spy.callCount, 2)
  clock.restore()
})
