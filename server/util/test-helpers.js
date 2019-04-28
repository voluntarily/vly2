/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
import mongoose from 'mongoose'
import { Mockgoose } from 'mockgoose'
// fix parallel tests
// eslint-disable-next-line space-before-function-paren
Mockgoose.prototype.prepareStorage = function() {
  const _this = this
  // eslint-disable-next-line prefer-arrow-callback
  return new Promise(function(resolve) {
    Promise.all([_this.getTempDBPath(), _this.getOpenPort()]).then(promiseValues => {
      const dbPath = promiseValues[0]
      const openPort = promiseValues[1].toString()
      const storageEngine = _this.getMemoryStorageName()
      const mongodArgs = ['--port', openPort, '--storageEngine', storageEngine, '--dbpath', dbPath]
      _this.mongodHelper.mongoBin.commandArguments = mongodArgs
      const mockConnection = () => {
        _this.mockConnectCalls(_this.getMockConnectionString(openPort))
        resolve()
      }
      _this.mongodHelper.run().then(mockConnection).catch(mockConnection)
    })
  })
}
const mockgoose = new Mockgoose(mongoose)

export async function connectDB() {
  await mockgoose.prepareStorage()
  await mongoose.connect('mongodb://localhost:27017/mern-test')
    .catch(() => 'Unable to connect to test database')
}

export async function dropDB() {
  await mockgoose.helper.reset()
    .catch(() => 'Unable to reset test database')
}
