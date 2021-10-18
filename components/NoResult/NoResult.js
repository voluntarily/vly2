import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Result } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

function NoResult ({
  id,
  msg,
  description,
  icon,
  iconTheme
}) {
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
      icon={<LegacyIcon type={icon} theme={iconTheme} />}
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
