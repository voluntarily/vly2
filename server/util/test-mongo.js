/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
import mongoose from 'mongoose'
import { v4 as uuid } from 'uuid'

/* This version skips mockgoose and creates the tests in a real database
    giving each file its own database id.
    problem is that the mongoose singleton seems to get shared across.
*/
export async function connectDB() {
  const connecturl = `mongodb://localhost:27017/vly-test-${uuid()}`
  await mongoose.connect(connecturl, { useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Test database connected:', connecturl))
    .catch(() => 'Unable to connect to test database')
}

export async function dropDB() {
  await mongoose.disconnect()
    .catch(() => 'Unable to reset test database')
}
