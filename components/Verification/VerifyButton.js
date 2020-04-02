import PropTypes from 'prop-types'
import { Button } from 'antd'

const VerifyButton = (props) => {
  return (<Button id='verifyButton' type='primary' shape='round' onClick={props.onClick}> Verify </Button>)
}

VerifyButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default VerifyButton
