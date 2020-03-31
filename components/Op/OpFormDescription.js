import { Form, Input } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeDescriptionPrompt } from './OpType'
const { TextArea } = Input

const opDescription = (
  <FormattedMessage
    id='OpShortForm.Description'
    defaultMessage='Is there anything specific you want to offer or need?'
    description='activity Description label in OpFormDescription'
  />
)

export const OpFormDescription = ({ getFieldDecorator, type }) =>

  <FormGrid>
    <DescriptionContainer>
      <TitleContainer>
        <h3><OpTypeDescriptionPrompt type={type} /></h3>
      </TitleContainer>
    </DescriptionContainer>
    <InputContainer>
      <MediumInputContainer>
        <Form.Item label={opDescription}>
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
