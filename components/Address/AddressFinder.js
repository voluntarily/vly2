import React, { useEffect, useState, useRef } from 'react'

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
