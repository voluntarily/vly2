import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InputNumber } from 'antd'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  display: grid;
  grid-template-columns: min-content min-content;
  grid-template-rows: auto auto;
  grid-auto-flow: column;
  grid-gap: 8px;

  span
  {
    line-height: normal;
  }
`

// TODO: Workaround - unable to use SFC here as there's an issue upstream in antd to do with
// refs and the new version of reactjs
class NumericRange extends React.Component {
  render () {
    const value = this.props.value || {}

    const onChange = (change) => this.props.onChange({ ...value, ...change })

    return (
      <Container>
        <FormattedMessage
          id='numericRange.from'
          defaultMessage='From:'
          description='The "from" value of a numeric range pair'
        />
        <InputNumber
          min={this.props.fromMin}
          max={this.props.fromMax}
          placeholder={this.props.fromPlaceholder}
          value={value.from}
          onChange={from => onChange({ from })}
          className='numeric-range-from'
        />

        <FormattedMessage
          id='numericRange.to'
          defaultMessage='to:'
          description='The "to" value of a numeric range pair'
        />
        <InputNumber
          min={this.props.toMin}
          max={this.props.toMax}
          placeholder={this.props.toPlaceholder}
          value={value.to}
          onChange={to => onChange({ to })}
          className='numeric-range-to'
        />
      </Container>
    )
  }
}

NumericRange.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  fromPlaceholder: PropTypes.string,
  fromMin: PropTypes.number,
  fromMax: PropTypes.number,
  toPlaceholder: PropTypes.string,
  toMin: PropTypes.number,
  toMax: PropTypes.number
}

export default NumericRange
