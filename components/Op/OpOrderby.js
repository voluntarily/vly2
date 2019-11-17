import React from 'react'
import { Select } from 'antd'
import { FormattedMessage } from 'react-intl'

const OpOrderby = (props) => {
  const style = {
    width: 150,
    float: 'right',
    position: 'relative',
    marginTop: -60
  }
  return (
    <Select placeholder='Sort By' defaultValue='Date' style={style} onChange={props.handleSort}>
      <Select.Option name='date' value='date'>
        <FormattedMessage
          id='sortDate'
          defaultMessage='Date'
          description='Sort order by Date'
        />
      </Select.Option>
      <Select.Option value='name'>
        <FormattedMessage
          id='sortName'
          defaultMessage='Name'
          description='Sort order by Name'
        />
      </Select.Option>
      <Select.Option value='commitment'>
        <FormattedMessage
          id='sortCommitment'
          defaultMessage='commitment'
          description='Sort order by commitment'
        />
      </Select.Option>
      {/* <option value='location'>Location</option> */}
    </Select>
  )
}
export default OpOrderby
