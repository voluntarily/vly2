import { Icon, Result } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

function NoResult (props) {
  const {
    id,
    msg,
    description,
    icon,
    iconTheme
  } = props

  const FormattedMsg = () => {
    return (
      <FormattedMessage
        id='{id}'
        defaultMessage='{msg}'
        description='{description}'
        values={{
          id: id,
          msg: msg,
          description: description
        }}
      />
    )
  }

  return (
    <Result
      icon={<Icon type={icon} theme={iconTheme} />}
      title={<FormattedMsg />}
    />
  )
}

NoResult.propTypes = {
  id: PropTypes.string.isRequired,
  msg: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconTheme: PropTypes.string
}

NoResult.defaultProps = {
  icon: 'frown',
  iconTheme: 'twoTone'
}

export default NoResult
