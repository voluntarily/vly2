import { Form, Input } from 'antd'
import React from 'react'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeDescriptionTitle, OpTypeDescriptionPrompt } from './OpType'
const { TextArea } = Input

export const OpFormDescription = ({ type }) => {
  const opDescriptionLabel = (
    <OpTypeDescriptionTitle type={type} />
  )

  return (
    <FormGrid>
      <DescriptionContainer>
        <TitleContainer>
          <h3><OpTypeDescriptionTitle type={type} /></h3>
          <p><OpTypeDescriptionPrompt type={type} /></p>
        </TitleContainer>
      </DescriptionContainer>
      <InputContainer>
        <MediumInputContainer>
          <Form.Item
            name='description'
            label={opDescriptionLabel}
            required
          >
            <TextArea rows={6} />
          </Form.Item>
        </MediumInputContainer>
      </InputContainer>
    </FormGrid>
  )
}
export default OpFormDescription
