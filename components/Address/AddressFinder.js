import React, { useEffect, useState, useRef } from 'react'
import { Input } from 'antd'
// A high order component to load a <script> of Address Finder Widget
export const withAddressFinder = (Component) => {
  const WrappedWithAddressFinderComponent = (props) => {
    const [scriptLoaded, setScriptLoaded] = useState(false)
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

    return <Component {...props} scriptLoaded={scriptLoaded} />
  }

  return WrappedWithAddressFinderComponent
}

export const AddressInput = ({
  value, onChange, scriptLoaded, addressFinderKey
}) => {
  const addressInputRef = useRef(null)
  useEffect(() => {
    if (!scriptLoaded) {
      return
    }

    const widget = new window.AddressFinder.Widget(
      // document.getElementById(inputRef),
      addressInputRef.current.input,
      addressFinderKey, // ADDRESSFINDER_KEY
      'NZ', {
        show_locations: true,
        empty_content: 'No addresses were found. This could be a new address, or you may need to check the spelling.'
      }
    )
    widget.on && widget.on('result:select', (_, metaData) => {
      const newAddress = {
        street: metaData.address_line_1,
        suburb: metaData.suburb,
        city: metaData.city,
        postcode: metaData.postcode,
        region: metaData.region.replace(/\sRegion/, ''),
        addressSummary: metaData.a
      }
      onChange(newAddress)
      addressInputRef.current.input.value = metaData.a
    })
  }, [scriptLoaded, addressFinderKey, onChange])

  return (
    <Input
      ref={addressInputRef}
      defaultValue={value?.addressSummary}
      placeholder='start typing an address'
      allowClear
    />
  )
}
