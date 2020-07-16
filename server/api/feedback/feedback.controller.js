const Feedback = require('./feedback')
const { Action } = require('../../services/abilities/ability.constants')

const createFeedback = async (req, res) => {
  const feedbackData = req.body
  const feedback = new Feedback(feedbackData)

  if ((!req.ability.can(Action.CREATE, feedback))) {
    return res.sendStatus(403)
  }
  try {
    await feedback.save()
    res.json(feedback)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ error: error.message })
    }
    return res.status(500).send({ error: error.message })
  }
}

module.exports = {
  createFeedback
}
