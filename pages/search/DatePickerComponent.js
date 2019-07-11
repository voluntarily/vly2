import React from 'react'
import DatePickerType from '../../components/Op/DatePickerType.constant'
import { DatePicker } from 'antd'
import moment from 'moment'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker
/**
 * Stupid component only show the type of date picker depends on the parent value passed down
 */
export default function DatePickerComponent (props) {
  const { onDateChange, dateValue } = props
  const convertedDateValueFromProps = dateValue.length === 0 ? null : moment(dateValue[0])
  switch (props.datePickerType) {
    case DatePickerType.MonthRange:
      return (<MonthPicker onChange={month => onDateChange(month)} value={convertedDateValueFromProps} />)
    case DatePickerType.DateRange:
      return (<RangePicker onChange={dates => onDateChange(dates)} />)
    case DatePickerType.WeekRange:
      return (<WeekPicker onChange={week => onDateChange(week)} value={convertedDateValueFromProps} />)
    default:
      return (<DatePicker onChange={date => onDateChange(date)} value={convertedDateValueFromProps} />)
  }
}

/**
 *  Format date value to string date label
 *  Nicer way of formating stuff
 * @param {*} datePickerType 
 * @param {*} value
 */
export const formatDateBaseOn = (datePickerType, value) => {
  switch(datePickerType) {
    case DatePickerType.MonthRange:
      return moment(value[0]).format('MM/YYYY')
    case DatePickerType.DateRange:
      return `${moment(value[0].get('date'))}-${moment(value).format('DD/MM/YY')}`
    case DatePickerType.WeekRange:
      return `Week ${moment(value[0]).week()}`
    default:
      return `${moment(value[0]).format('DD/MM/YY')}`
  }
} 