import { Form, DatePicker, Icon, Input, Tooltip } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, ShortInputContainer, InputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeDateTitle, OpTypeDatePrompt } from './OpType'
import moment from 'moment'

const opCommitment = (
  <span>
    <FormattedMessage
      id='OpOfferForm.Commitment'
      defaultMessage='Commitment'
      description='activity Commitment label in OpOfferForm Form'
    />
    &nbsp;
    <Tooltip title='How much time overall is likely to be required for the activity?'>
      <Icon type='question-circle-o' />
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
      <Icon type='question-circle-o' />
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
//       <Icon type='question-circle-o' />
//     </Tooltip>
//   </span>
// )
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
        <Form.Item label={opCommitment} name='Commitment'>
          {getFieldDecorator('duration')(<Input className='commitment' placeholder='1 hour' />)}
        </Form.Item>
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
