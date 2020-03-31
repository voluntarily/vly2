import { Form } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import TagInput from '../Form/Input/TagInput'
import { DescriptionContainer, FormGrid, InputContainer, TitleContainer } from '../VTheme/FormStyles'

const opTags = (
  <FormattedMessage
    id='OpShortForm.Tags'
    defaultMessage='Tags'
    description='Descriptions of general areas the activity relates to'
  />
)

export const OpFormTags = ({ getFieldDecorator, existingTags }) =>
  <FormGrid>
    <DescriptionContainer>
      <TitleContainer>
        <h3>
          <FormattedMessage
            id='OpShortForm.AskForm.tags.label'
            description='Section label for op tags'
            defaultMessage='Do you have any specific skills or resources?'
          />
        </h3>
      </TitleContainer>
      <p>
        <FormattedMessage
          id='OpShortForm.AskForm.tags.prompt'
          description='Section prompt for op tags'
          defaultMessage='Does what you are asking for fit into any specific categories like programming, electronics, or robots? Enter them here to make it easier for volunteers to find you.'
        />
      </p>
    </DescriptionContainer>
    <InputContainer>
      <Form.Item label={opTags}>
        {getFieldDecorator('tags')(<TagInput existingTags={existingTags} />)}
      </Form.Item>
    </InputContainer>
  </FormGrid>

export default OpFormTags
