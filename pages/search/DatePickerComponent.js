import React from 'react'
import { DatePicker } from 'antd'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker
/**
 * Stupid components only show the type of date picker depends on the parent value passed down
 */
export default function DatePickerComponent(props) {
    const { onDateChange } = props
    switch (props.datePickerType) {
        case 'month':
            return (<MonthPicker onChange={month => onDateChange(month)} />)
        case 'rangePicker':
            return (<RangePicker onChange={dates => onDateChange(dates)} />)
        case 'weekPicker':
            return (<WeekPicker onChange={week => onDateChange(week)} />)
        default:
            return (<DatePicker onChange={date => onDateChange(date)} />)
    }
}
