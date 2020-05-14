import { Form, Icon, Tooltip, Input, Row, Col } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { DescriptionContainer, FormGrid, InputContainer, MediumInputContainer, TitleContainer } from '../VTheme/FormStyles'
import { OpTypeLocationPrompt } from './OpType'
import OpFormOrg from './OpFormOrg'
// import TagSelect from '../Form/Input/TagSelect'

// const opLocation = (
//   <span>
//     {' '}
//     <FormattedMessage
//       id='OpShortForm.Location'
//       defaultMessage='Region'
//       description='activity Location label in OpAskForm Form'
//     />
//     &nbsp;
//     <Tooltip title='set the town or suburb for this activity'>
//       <Icon type='question-circle-o' />
//     </Tooltip>
//   </span>
// )
const opAddress = (
  <span>
    {' '}
    <FormattedMessage
      id='OpShortForm.Address'
      defaultMessage='Address'
      description='activity Address label in OpAskForm Form'
    />
    &nbsp;
    <Tooltip title='set the specific address for this activity'>
      <Icon type='question-circle-o' />
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
export const OpFormLocation = ({ getFieldDecorator, type, existingLocations, orgMembership, addressFinderKey, setFieldsValue }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const addressRef = useRef(null)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    if (window.AddressFinder) {
      setScriptLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://api.addressfinder.io/assets/v3/widget.js'
    script.async = true
    script.addEventListener('load', () => {
      if (mounted.current) {
        setScriptLoaded(true)
      }
    })
    window.document.body.appendChild(script)
    return () => {
      mounted.current = false
      window.document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (scriptLoaded && mounted.current) {
      const widget = new window.AddressFinder.Widget(
        addressRef.current.input,
        addressFinderKey, // ADDRESSFINDER_KEY
        'NZ', {
          show_locations: true,
          empty_content: 'No addresses were found. This could be a new address, or you may need to check the spelling.'
        }
      )
      widget.on('result:select', function (fullAddress, metaData) {
        const region = metaData.region.split(' ')
        setFieldsValue({ address: metaData.address_line_1 })
        setFieldsValue({ suburb: metaData.selected_suburb })
        setFieldsValue({ city: metaData.selected_city })
        setFieldsValue({ postcode: metaData.postcode })
        setFieldsValue({ region: region[0] })
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
          {/* <Form.Item label={opLocation}>
            {getFieldDecorator('locations')(
              <TagSelect ref={regionRef} values={existingLocations} placeholder='Select location' />
            )}
          </Form.Item> */}
          <Form.Item label={opAddress}>
            {getFieldDecorator('address')(
              <Input ref={addressRef} placeholder='Address line' allowClear />
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

export default OpFormLocation
