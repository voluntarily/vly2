import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Result, Icon } from 'antd'

const FormattedMsg = () => {
  return (
    <FormattedMessage 
      id='act.noresult'
      defaultMessage='No activities found based on your search criteria'
      description='Message to show when no activities found'
    />
  )
}

const NoResult = () => {
  return (
    <Result
      icon={<Icon type='frown' theme='twoTone' />}
      title={<FormattedMsg />}
    />
  )
}

export default NoResult
