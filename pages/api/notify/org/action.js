import { handleToken } from '../../token/token'

export default (req, res) => handleToken(req, res, {
  join: props => console.log('join', props)
})
