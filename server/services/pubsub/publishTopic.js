const PubSub = require('pubsub-js')

/*  middleware that will publish an event when a new entity is created
  add this to an entity in entity.routes.js after actions e.g. person.routes.js
  it will issue a new message each time a new item is created

*/
// Run the given function on the object or if it is an array run it on each array item
const OneOrMany = (obj, fn) => {
  if (Array.isArray(obj)) {
    obj.map(item => fn(item))
  } else {
    fn(obj)
  }
}

const publishCreate = (Model) => (req, res, next) => {
  const topic = Symbol(`${Model.modelName.toUpperCase()}.CREATE`)
  OneOrMany(req.crudify.result, item => PubSub.publish(topic, item))
  next()
}

module.exports = {
  publishCreate
}
