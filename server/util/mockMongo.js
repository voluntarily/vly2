// mockMongo
// File for abstracting generic before, beforeEach, afterEach and after code
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
// mongoose.Promise = Promise

const mongooseOpts = {
  // options for mongoose 4.11.3 and above
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  poolSize: 40,
  // autoReconnect: true,
  socketTimeoutMS: 360000,
  connectTimeoutMS: 360000
  // reconnectTries: Number.MAX_VALUE // Never stop trying to reconnect
  // bufferMaxEntries: 0 // fail immediately there's no connection
}

export const startMongo = async (t) => {
  t.context.mongod = await MongoMemoryServer.create()
  const uri = t.context.mongod.getUri()
  t.context.connection = mongoose.connect(uri, mongooseOpts)

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e, 'retry')
      mongoose.connect(this.mongoUri, mongooseOpts)
    }
    console.log(e)
  })

  // mongoose.connection.once('open', () => {
  //   console.log(`MongoDB successfully connected to ${uri}`)
  // })
}

export const stopMongo = async (t) => {
  try {
    // await mongoose.disconnect()
    delete t.context.connection
    await t.context.mongod.stop()
    delete t.context.mongod
  } catch (err) {
    console.error(err)
  }
}

// mongoose.connection.on('index', (e) => { console.log(e, 'Index event') })
// mongoose.connection.on('connecting', (e) => { console.log(e, 'Emitted when Mongoose starts making its initial connection to the MongoDB server') })
// mongoose.connection.on('connected', (e) => { console.log(e, 'connected: Emitted when Mongoose successfully makes its initial connection to the MongoDB server') })
// mongoose.connection.on('disconnecting', (e) => { console.log(e, 'disconnecting: Your app called Connection#close() to disconnect from MongoDB') })
// mongoose.connection.on('disconnected', (e) => { console.log(e, 'disconnected: Emitted when Mongoose lost connection to the MongoDB server. This event may be due to your code explicitly closing the connection, the database server crashing, or network connectivity issues.') })
// mongoose.connection.on('close', (e) => { console.log(e, "close: Emitted after Connection#close() successfully closes the connection. If you call conn.close(), you'll get both a 'disconnected' event and a 'close' event.") })
// mongoose.connection.on('reconnected', (e) => { console.log(e, 'reconnected: Emitted if Mongoose lost connectivity to MongoDB and successfully reconnected. Mongoose attempts to automatically reconnect when it loses connection to the database.') })
// mongoose.connection.on('error', (e) => { console.log(e, 'error: Emitted if an error occurs on a connection, like a parseError due to malformed data or a payload larger than 16MB.') })
// mongoose.connection.on('reconnectFailed', (e) => { console.log(e, "reconnectFailed: Emitted when you're connected to a standalone server and Mongoose has run out of reconnectTries. The MongoDB driver will no longer attempt to reconnect after this event is emitted. This event will never be emitted if you're connected to a replica set.") })

//   cleanup () {
//     // return Promise.all(COLLECTIONS.map(c => this.db.collection(c).remove({})))
//   }
// }
