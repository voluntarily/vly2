import { Form, Input } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeDescriptionTitle, OpTypeDescriptionPrompt } from './OpType'
const { TextArea } = Input

const opDescriptionLabel = (
  <FormattedMessage
    id='OpShortForm.DescriptionTitle'
    defaultMessage='More information'
    description='activity Description title in OpFormDescription'
  />

)

export const OpFormDescription = ({ getFieldDecorator, type }) =>

  <FormGrid>
    <DescriptionContainer>
      <TitleContainer>
        <h3><OpTypeDescriptionTitle type={type} /></h3>
        <p><OpTypeDescriptionPrompt type={type} /></p>
      </TitleContainer>
    </DescriptionContainer>
    <InputContainer>
      <MediumInputContainer>
        <Form.Item label={opDescriptionLabel}>
          {getFieldDecorator('description')(
            <TextArea
              rows={6}
            />
          )}
        </Form.Item>
      </MediumInputContainer>
    </InputContainer>
  </FormGrid>
export default OpFormDescription
