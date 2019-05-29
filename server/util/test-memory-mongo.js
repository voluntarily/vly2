// mockMongo
// File for abstracting generic before, beforeEach, afterEach and after code
import mongoose from 'mongoose'
mongoose.Promise = Promise
const { MongoMemoryServer } = require('mongodb-memory-server')

class MemoryMongo {
  constructor () {
    this.connection = null
    this.mms = new MongoMemoryServer({
      debug: false, // by default false
      binary: {
        debug: false
        // version: '4.0.5'
      }
    })
  }

  async start () {
    this.mongoUri = await this.mms.getConnectionString()
    // console.log('Test mongodb connecting to:', this.mongoUri)
    const mongooseOpts = {
      // options for mongoose 4.11.3 and above
      useNewUrlParser: true,
      useCreateIndex: true
    }
    this.connection = await mongoose.connect(this.mongoUri, mongooseOpts)

  }

  async stop () {
    try {
      // await mongoose.disconnect()
      this.connection = null
      // console.log('test mongodb disconnected', this.mongoUri)
      await this.mms.stop()
      this.mms = null
    } catch (err) {
      console.error(err)
    }
  }

  cleanup () {
    // return Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({})))
  }
}

module.exports = MemoryMongo
