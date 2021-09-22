import { Form, DatePicker, Icon, Input, Tooltip, Row, Col } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, ShortInputContainer, InputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeDateTitle, OpTypeDatePrompt } from './OpType'
import moment from 'moment'
import { QuestionCircleOutlined } from '@ant-design/icons'
const opCommitment = (
  <span>
    <FormattedMessage
      id='OpOfferForm.label.Commitment'
      defaultMessage='How much time is needed.'
      description='activity Commitment label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title='How much time overall is likely to be required for the activity?'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)

const opStartDate = (
  <span>
    {' '}
    <FormattedMessage
      id='OpShortForm.StartDate'
      defaultMessage='Available Date / Time'
      description='activity start date label in Op Short Form'
    />
    &nbsp;
    <Tooltip title='Set a start date if the activity needs to be done at a specific time, otherwise leave blank.'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)

// const opEndDate = (
//   <span>
//     {' '}
//     <FormattedMessage
//       id='OpShortForm.EndDate'
//       defaultMessage='End Date'
//       description='activity end date label in OpAskForm Form'
//     />
//     &nbsp;
//     <Tooltip title='Set an end date if the activity needs more than one day.'>
//       <QuestionCircleOutlined />
//     </Tooltip>
//   </span>
// )

const durationRules = [{
  type: 'number',
  message: 'duration values must be a non negative integer',
  validator: (_rule, value) => value >= 0
}]

/**
 * Show Date and Commitment section of form
 * @param {} param0
 */
export const OpFormDate = ({ getFieldDecorator, type, onChange }) =>
  <FormGrid>
    <DescriptionContainer>
      <TitleContainer>
        <h3><OpTypeDateTitle type={type} /></h3>
      </TitleContainer>
      <p><OpTypeDatePrompt type={type} /></p>
    </DescriptionContainer>
    <InputContainer>
      <ShortInputContainer>
        <Row type='flex' justify='space-between'>
          <Col span={10}>
            <Form.Item label={opCommitment} name='CommitmentHours'>
              {getFieldDecorator('durationHours', { rules: durationRules })(<Input className='commitment' placeholder='1 hour' addonAfter='hours' />)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label=' ' name='CommitmentMinutes'>
              {getFieldDecorator('durationMinutes', { rules: durationRules })(<Input className='commitment' placeholder='1 minute' addonAfter='minutes' />)}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={opStartDate} name='Start date'>
          {getFieldDecorator('startDate')(
            <DatePicker
              showTime
              disabledDate={current => {
                return (
                  moment().add(-1, 'days') >= current ||
                          moment().add(1, 'year') <= current
                )
              }}
              format='DD-MM-YYYY HH:mm:ss'
              onChange={onChange}
              style={{ width: '100%' }}
            />
          )}
        </Form.Item>
      </ShortInputContainer>
    </InputContainer>
  </FormGrid>
export default OpFormDate
