import { FormattedMessage } from 'react-intl'
import { Ul, Li } from '../../VTheme/VTheme'
import PropTypes from 'prop-types'

const TeacherRegistrationRecord = ({ trr }) =>
  <div>
    <FormattedMessage
      id='TeacherRegistrationRecord.title'
      defaultMessage='Teacher Registration Record'
    />
    <Ul>
      <Li>
        <FormattedMessage
          id='TeacherRegistrationRecord.registrationNumber'
          defaultMessage='Registration Number'
        />: {trr.trn}
      </Li>
      <Li>
        <FormattedMessage
          id='TeacherRegistrationRecord.name'
          defaultMessage='Name'
        />: {trr.firstname} {trr.lastname}
      </Li>
      <Li>
        <FormattedMessage
          id='TeacherRegistrationRecord.Category'
          defaultMessage='Category'
        />: {trr.category}
      </Li>
      <Li>
        <FormattedMessage
          id='TeacherRegistrationRecord.Expiry'
          defaultMessage='Expiry'
        />: {trr.expiry}
      </Li>
    </Ul>
  </div>

TeacherRegistrationRecord.propTypes = {
  trr: PropTypes.shape({
    trn: PropTypes.string, // teacher registration number
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    category: PropTypes.string,
    expiry: PropTypes.string
  }).isRequired
}
export default TeacherRegistrationRecord
