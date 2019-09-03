const Opportunity = require('../opportunity/opportunity')
const Person = require('../person/person')
const Organisation = require('../organisation/organisation')
const Activity = require('../activity/activity')

const forall = (model, action) => {
  var cursor = model.find().cursor()

  // Execute the each command, triggers for each document
  cursor.eachAsync(item => {
    action(item)
    // return user.save().exec()        // Need promise
  }).then(
    (res) => console.log('db action completed'),
    (err) => console.log('db action failed', err)
  )
}

const getModel = name => {
  switch (name) {
    case 'Organisation': return Organisation
    case 'Opportunity': return Opportunity
    case 'Activity': return Activity
    case 'Person': return Person
  }
}

/*
  DB Action Endpoint is used to perform some Database admin activities
  Note - because this is a tool for updating the database when the schema changes
  the code does not form part of the main applicaiton and is thus excluded from
  test coverage
*/
const dbAction = (req, res) => {
  switch (req.params.action) {
    case 'log':
      console.log('db', req.query.msg)
      break
    case 'list': {
      const model = getModel(req.query.e)
      if (model) { forall(model, console.log) }
      break
    }

    case 'fixName': {
      const model = getModel(req.query.e)
      if (model) {
        forall(model, async item => {
          if (item.title) {
            item.name = item.title
            delete item.title
            await item.save()
          }
          if (item.avatar) {
            item.imgUrl = item.avatar
            delete item.avatar
            await item.save()
          }
        })
      }
      break
    }
  }
  const result = {
    message: `DB Action ${req.params.action}`,
    params: req.params,
    query: req.query
  }
  return res.status(200).json(result)
}

module.exports = {
  dbAction,
  getModel
}
