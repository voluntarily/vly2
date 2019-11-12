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
const NumericRange = (props) => {
  const onChange = (change) => props.onChange({ ...(props.value || {}), ...change })

  return (
    <Container>
        <span>From: </span>
        <InputNumber placeholder={props.fromPlaceholder} onChange={from => onChange({ from })} />

        <span>to: </span>
        <InputNumber placeholder={props.toPlaceholder} onChange={to => onChange({ to })} />
    </Container>)
}

NumericRange.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  fromPlaceholder: PropTypes.string,
  toPlaceholder: PropTypes.string,
}

export default NumericRange
