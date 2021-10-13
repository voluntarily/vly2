import { DatePicker, Form, Input, Tooltip, Row, Col } from 'antd'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, ShortInputContainer, InputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeDateTitle, OpTypeDatePrompt } from './OpType'
import moment from 'moment'
import { QuestionCircleOutlined } from '@ant-design/icons'
// const opCommitment = (
//   <span>
//     <FormattedMessage
//       id='OpOfferForm.label.Commitment'
//       defaultMessage='How much time is needed.'
//       description='activity Commitment label in OpOfferForm Form'
//     />
//     &nbsp;
//     <Tooltip title='How much time overall is likely to be required for the activity?'>
//       <QuestionCircleOutlined />
//     </Tooltip>
//   </span>
// )

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
  type: 'string',
  warningOnly: true,
  validator: (_, value) => {
    const v = parseInt(value)
    if (!isNaN(v) && v >= 0 && v < 60) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Enter a number between 0 and 60'))
  }
}]

/**
 * Show Date and Commitment section of form
 * @param {} param0
 */
export const OpFormDate = ({ type }) =>
  <FormGrid>
    <DescriptionContainer>
      <TitleContainer>
        <h3><OpTypeDateTitle type={type} /></h3>
      </TitleContainer>
      <p><OpTypeDatePrompt type={type} /></p>
    </DescriptionContainer>
    <InputContainer>
      <ShortInputContainer>
        <Form.Item label={opStartDate} name='startDate'>
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            disabledDate={current => {
              return (
                moment().add(-1, 'days') >= current ||
                          moment().add(1, 'year') <= current
              )
            }}
            format='DD-MM-YYYY HH:mm'
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Row type='flex' justify='space-between'>
          <Col span={10}>
            <Form.Item name='durationHours' rules={durationRules}>
              <Input className='commitment' placeholder='1' addonAfter='hours' />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name='durationMinutes' rules={durationRules}>
              <Input className='commitment' placeholder='1' addonAfter='minutes' />
            </Form.Item>
          </Col>
        </Row>

      </ShortInputContainer>
    </InputContainer>
  </FormGrid>

export default OpFormDate
