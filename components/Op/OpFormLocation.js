import React, { useState, useRef } from 'react'
import { Form, Tooltip, Input } from 'antd'
import { FormattedMessage } from 'react-intl'

import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeLocationPrompt } from './OpType'
import OpFormOrg from './OpFormOrg'
import { AddressInput, withAddressFinder } from '../Address/AddressFinder'
import { QuestionCircleOutlined } from '@ant-design/icons'
const opAddress = (
  <span>
    {' '}
    <FormattedMessage
      id='OpShortForm.Address'
      defaultMessage='Address'
      description='activity Address label in OpShortForm'
    />
    &nbsp;
    <Tooltip title='set the street address for this activity'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
export const OpFormLocation = ({ form, type, orgMembership, scriptLoaded, addressFinderKey }) => {
  const handleNewAddress = (address) => {
    form.setFieldsValue({
      address
    })
  }
  return (
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
          <Form.Item
            name='address'
            label={opAddress}
          >
            <AddressInput onChange={handleNewAddress} scriptLoaded={scriptLoaded} addressFinderKey={addressFinderKey} />
          </Form.Item>
          <OpFormOrg type={type} orgMembership={orgMembership} />
        </MediumInputContainer>
      </InputContainer>
    </FormGrid>
  )
}

export default withAddressFinder(OpFormLocation)
