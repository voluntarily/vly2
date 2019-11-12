import * as React from 'react'
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
  render() {
    const onChange = (change) => this.props.onChange({ ...(this.props.value || {}), ...change })

    return (
      <Container>
          <span>From: </span>
          <InputNumber placeholder={this.props.fromPlaceholder} onChange={from => onChange({ from })} />

          <span>to: </span>
          <InputNumber placeholder={this.props.toPlaceholder} onChange={to => onChange({ to })} />
      </Container>)
  }
}

NumericRange.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  fromPlaceholder: PropTypes.string,
  toPlaceholder: PropTypes.string,
}

export default NumericRange
