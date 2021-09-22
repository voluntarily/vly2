import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Tooltip, Input, Row, Col } from 'antd'
import React, { useEffect, useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeLocationPrompt } from './OpType'
import OpFormOrg from './OpFormOrg'
import { withAddressFinder } from '../Address/AddressFinder'
import { QuestionCircleOutlined } from '@ant-design/icons'
const opStreet = (
  <span>
    {' '}
    <FormattedMessage
      id='OpShortForm.Street'
      defaultMessage='Street'
      description='activity Street label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='set the street address for this activity'>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
)
const opSuburb = (
  <span>
    <FormattedMessage
      id='OpShortForm.Suburb'
      defaultMessage='Suburb'
      description='activity Suburb label in OpAskForm Form'
    />
  </span>
)
const opCity = (
  <span>
    <FormattedMessage
      id='OpShortForm.City'
      defaultMessage='City'
      description='activity City label in OpAskForm Form'
    />
  </span>
)
const opPostcode = (
  <span>
    <FormattedMessage
      id='OpShortForm.Postcode'
      defaultMessage='Postcode'
      description='activity Postcode label in OpAskForm Form'
    />
  </span>
)
const opRegion = (
  <span>
    <FormattedMessage
      id='OpShortForm.Region'
      defaultMessage='Region'
      description='activity Region label in OpAskForm Form'
    />
  </span>
)

export const OpFormLocation = ({ getFieldDecorator, setFieldsValue, type, orgMembership, scriptLoaded, addressFinderKey }) => {
  const streetRef = useRef(null)

  useEffect(() => {
    if (scriptLoaded) {
      const widget = new window.AddressFinder.Widget(
        streetRef.current.input,
        addressFinderKey, // ADDRESSFINDER_KEY
        'NZ', {
          show_locations: true,
          empty_content: 'No addresses were found. This could be a new address, or you may need to check the spelling.'
        }
      )
      widget.on('result:select', (_, metaData) => {
        const region = metaData.region.replace(/\sRegion/, '')
        setFieldsValue({ street: metaData.address_line_1 })
        setFieldsValue({ suburb: metaData.selected_suburb })
        setFieldsValue({ city: metaData.selected_city })
        setFieldsValue({ postcode: metaData.postcode })
        setFieldsValue({ region: region })
      })
    }
  }, [scriptLoaded])

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
          <Form.Item label={opStreet}>
            {getFieldDecorator('street')(
              <Input ref={streetRef} placeholder='Street address' allowClear />
            )}
          </Form.Item>
          <Row type='flex' justify='space-between'>
            <Col span={10}>
              <Form.Item label={opSuburb}>
                {getFieldDecorator('suburb')(
                  <Input placeholder='Suburb' />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label={opCity}>
                {getFieldDecorator('city')(
                  <Input placeholder='City' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type='flex' justify='space-between'>
            <Col span={10}>
              <Form.Item label={opPostcode}>
                {getFieldDecorator('postcode')(
                  <Input placeholder='Postcode' />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label={opRegion}>
                {getFieldDecorator('region')(
                  <Input placeholder='Region' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <OpFormOrg getFieldDecorator={getFieldDecorator} type={type} orgMembership={orgMembership} />
        </MediumInputContainer>
      </InputContainer>
    </FormGrid>
  )
}

export default withAddressFinder(OpFormLocation)
