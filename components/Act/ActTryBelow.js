/*
  Display an activity record in card format with a picture, name, and commitment.
*/
import { FormattedMessage } from 'react-intl'
import { Role } from '../../server/services/authorize/role'

/**
 *  Display a message in the Activity Banner under the action buttons
 * prompt the person to review existing ops before creating a new one
 * TODO: change message if the opCounts are zero.
 * @param {*} act
 */
const opCountThreshold = 2
export const ActTryBelow = ({ counts, role }) => {
  return (role.includes(Role.OPPORTUNITY_PROVIDER) && (counts.ask + counts.offer > opCountThreshold))
    ? (
      <FormattedMessage
        id='ActTryBelow.prompt'
        defaultMessage='Check below whether you can help with existing asks and offers before creating new ones.'
        description='prompt the person to review existing ops before creating a new one'
      />)
    : null
}

export default ActTryBelow
