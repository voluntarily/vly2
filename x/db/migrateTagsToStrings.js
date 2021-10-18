/* eslint-disable no-console */
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const url = 'mongodb://localhost:27017/'
const dbname = 'vly2'

const allTags = new Set()
let dbo
// old tag style "tags":[{"_id":"5d96901c94bcb300124d3d55","tag":"acti","__v":0},{"_id":"5d113a92ad00d00011f7e331","tag":"express","__v":0}

const findTagById = async function (tagId) {
  const t = await dbo.collection('tags').findOne({ _id: new ObjectId(tagId) })
  return t.tag
}

const convertTags = async function (doc) {
  if (doc.tags) {
    const docTags = []
    const tagStrings = doc.tags.map(async tag => {
      let tagString = tag
      if (typeof tag === 'object') {
        if (tag.tag) {
          tagString = tag.tag
        } else {
          tagString = findTagById(tag._id)
        }
      }
      return tagString
    })
    for (const tagPromise of tagStrings) {
      const tagString = await tagPromise
      docTags.push(tagString)
      allTags.add(tagString)
    }
    doc.tags = docTags
  }
  return doc
}

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
  if (err) throw err
  dbo = db.db(dbname)
  const operations = ['people', 'opportunities', 'activities'].map(col => {
    console.log('Updating collection', col)
    return new Promise((resolve, reject) => {
      dbo.collection(col).find().toArray(async (err, result) => {
        if (err) {
          console.err('rejected', err)
          reject(err)
        }
        for (const doc of result) {
          const before = [...doc.tags]
          const updated = await convertTags(doc)
          console.log('Processing', doc._id.toString())
          console.log('\tUpdating', before, 'to', updated.tags)
          await dbo.collection(col).updateOne({ _id: updated._id }, { $set: updated })
          resolve()
        }
      })
    })
  })

  Promise.all(operations).then(res => {
    return dbo.collection('taglists').updateOne({}, { $set: { tags: [...allTags] } }, { upsert: true }).then(res => {
      console.log('cleaning up')
      db.close()
    })
  }).catch(err => {
    console.log('errored', err)
  })
})
