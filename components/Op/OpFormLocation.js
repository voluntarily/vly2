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
export const OpFormLocation = ({ getFieldDecorator, type, existingLocations, orgMembership }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const regionRef = useRef(null)
  const addressRef = useRef(null)
  const suburbRef = useRef(null)
  const cityRef = useRef(null)
  const postcodeRef = useRef(null)
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
        'RGE83VMK4UYHXNJBP69W', // ADDRESSFINDER_KEY
        'NZ', {
          address_params: {},
          show_locations: true,
          empty_content: 'No addresses were found. This could be a new address, or you may need to check the spelling.'
        }
      )
      widget.on('address:select', function (fullAddress, metaData) {
        addressRef.current.input.value = metaData.address_line_1
        suburbRef.current.input.value = metaData.selected_suburb
        cityRef.current.input.value = metaData.selected_city
        postcodeRef.current.input.value = metaData.postcode
        regionRef.current.input.value = metaData.region
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
                  <Input ref={suburbRef} placeholder='Suburb' />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label={opCity}>
                {getFieldDecorator('city')(
                  <Input ref={cityRef} placeholder='City' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row type='flex' justify='space-between'>
            <Col span={10}>
              <Form.Item label={opPostcode}>
                {getFieldDecorator('postcode')(
                  <Input ref={postcodeRef} placeholder='Postcode' />
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label={opRegion}>
                {getFieldDecorator('region')(
                  <Input ref={regionRef} placeholder='Region' />
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
