import { Form, Icon, Tooltip } from 'antd'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeLocationPrompt } from './OpType'
import OpFormOrg from './OpFormOrg'
import TagSelect from '../Form/Input/TagSelect'

const opLocation = (
  <span>
    {' '}
    <FormattedMessage
      id='OpShortForm.Location'
      defaultMessage='Region'
      description='activity Location label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='set the town or suburb for this activity'>
      <Icon type='question-circle-o' />
    </Tooltip>
  </span>
)
export const OpFormLocation = ({ getFieldDecorator, type, existingLocations, orgMembership }) =>
  <FormGrid>
    <DescriptionContainer>
      <TitleContainer>
        <h3>
          <OpTypeLocationPrompt type={type} />
        </h3>
      </TitleContainer>
    </DescriptionContainer>
    <InputContainer>
      <MediumInputContainer>
        <Form.Item label={opLocation}>
          {getFieldDecorator('locations')(
            <TagSelect values={existingLocations} placeholder='Select location' />
          )}
        </Form.Item>
        <OpFormOrg getFieldDecorator={getFieldDecorator} type={type} orgMembership={orgMembership} />
      </MediumInputContainer>
    </InputContainer>
  </FormGrid>

export default OpFormLocation
