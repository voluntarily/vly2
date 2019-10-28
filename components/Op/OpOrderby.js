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
    <Select placeholder='Sort By' style={style} onChange={props.sortHandler}>
      <option name='date' value='date'><FormattedMessage
        id='sortDate'
        defaultMessage='Date'
        description='Sort order by Date'
      /></option>
      <option value='name'><FormattedMessage
        id='sortName'
        defaultMessage='Name'
        description='Sort order by Name'
      /></option>
      <option value='commitment'><FormattedMessage
        id='sortCommitment'
        defaultMessage='commitment'
        description='Sort order by commitment'
      /></option>
      {/* <option value='location'>Location</option> */}
    </Select>
  )
}
export default OpOrderby
