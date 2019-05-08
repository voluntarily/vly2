// mockMongo
// File for abstracting generic before, beforeEach, afterEach and after code
import mongoose from 'mongoose'

const { MongoMemoryServer } = require('mongodb-memory-server')

class MockMongo {
  constructor () {
    this.mms = new MongoMemoryServer()
    this.connection = null
  }

  async start () {
    const mongoUri = await this.mms.getConnectionString()
    this.connection = await mongoose.connect(mongoUri, { useNewUrlParser: true })
    console.log('Test mongodb connected at:', mongoUri)
    // this.db = this.connection.db(await this.mms.getDbName())
  }

  stop () {
    mongoose.disconnect()
    return this.mms.stop()
  }

  cleanup () {
    // return Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({})))
  }
}

module.exports = MockMongo
