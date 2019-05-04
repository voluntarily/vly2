const Interest = require('./interest')

const initialInterests = function () {
  Interest.estimatedDocumentCount().exec(count => {
    if (count > 0) {
      return
    }

    const interests = [
      new Interest({
          personId: '12345',
          opportunityId: '54321',
          comment: 'this is me',
      }),
      new Interest({
        personId: '12345',
        opportunityId: '42',
        comment: 'please pick me! :P',
    })
    ]

    Interest.create(interests, (error) => {
      if (!error) {
      //  console.log('Loaded Activities....');
      }
    })
  })
}
module.exports = initialInterests