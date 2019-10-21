import React from 'react'
import { Select } from 'antd'

const OpOrder = (props) => {
  const style = {
    width: 150,
    float: 'right',
    position: 'relative',
    marginTop: -60
  }
  return (
    <Select defaultValue='name' style={style} onChange={props.sortHandler}>
      <option value='name'>name</option>
      <option value='date'>date</option>
      <option value='location'>location</option>
      <option value='commitment'>commitment</option>
    </Select>
  )
}
export default OpOrder
