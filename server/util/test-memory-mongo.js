// mockMongo
// File for abstracting generic before, beforeEach, afterEach and after code
import mongoose from 'mongoose'
// mongoose.Promise = Promise
const { MongoMemoryServer } = require('mongodb-memory-server')

class MemoryMongo {
  constructor () {
    this.connection = null
    this.mms = new MongoMemoryServer({
      debug: false // by default false
    })
  }

  async start () {
    const mongoUri = await this.mms.getConnectionString()
    console.log('Test mongodb connecting to:', mongoUri)
    const mongooseOpts = {
      // options for mongoose 4.11.3 and above
      useNewUrlParser: true
    }
    this.connection = await mongoose.connect(mongoUri, mongooseOpts)
  }

  stop () {
    mongoose.disconnect()
    return this.mms.stop()
  }

  cleanup () {
    // return Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({})))
  }
}

module.exports = MemoryMongo
