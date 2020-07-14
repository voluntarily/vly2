import React from 'react'
import { Select } from 'antd'

const timeframeOptions = [
  {
    name: 'Last Month',
    value: 'month'
  },
  {
    name: 'Last Year',
    value: 'year'
  }
]

const StatisticsTimeframeSelector = ({ value, onChange }) => {
  return (
    <Select value={value} onChange={onChange}>
      {timeframeOptions.map((option, i) => (
        <Select.Option value={option.value} key={i}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default StatisticsTimeframeSelector
