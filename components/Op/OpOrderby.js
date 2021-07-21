import React from 'react'
import { Select } from 'antd'
import { FormattedMessage } from 'react-intl'

const OpOrderby = ({ onChange }) => {
  const style = {
    width: 250,
    float: 'right',
    position: 'relative',
    marginTop: -60
  }
  return (
    <Select placeholder='Sort By' defaultValue='Sort by date' lable='Sort by' style={style} onChange={onChange}>
      <Select.Option name='date' value='date'>
        <FormattedMessage
          id='sortDate'
          defaultMessage='Sort by date'
          description='Sort order by Date'
        />
      </Select.Option>
      <Select.Option value='name'>
        <FormattedMessage
          id='sortName'
          defaultMessage='Sort by name'
          description='Sort order by Name'
        />
      </Select.Option>
      <Select.Option value='commitment'>
        <FormattedMessage
          id='sortCommitment'
          defaultMessage='Sort by time commitment'
          description='Sort order by commitment'
        />
      </Select.Option>
      {/* <option value='location'>Location</option> */}
    </Select>
  )
}
export default OpOrderby
