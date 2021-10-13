import PropTypes from 'prop-types'
import { Button } from 'antd'
import { FormattedMessage } from 'react-intl'

const VerifyButton = (props) => {
  return (
    <Button id='verifyButton' type='primary' shape='round' onClick={props.onClick}>
      <FormattedMessage
        id='VerifyButton.label'
        defaultMessage='Verify Identity'
      />
    </Button>
  )
}

VerifyButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default VerifyButton
