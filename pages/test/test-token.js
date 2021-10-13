
import React, { useState, useEffect } from 'react'
import { FullPage } from '../../components/VTheme/VTheme'
import callApi from '../../lib/callApi'
import queryString from 'querystring'

const Payload = ({ payload }) =>
  <dl>
    <dt>landingUrl</dt><dd>{payload.landingUrl}</dd>
    <dt>redirectUrl</dt><dd>{payload.redirectUrl}</dd>
    <dt>data</dt><dd>{JSON.stringify(payload.data)}</dd>
    <dt>action</dt><dd>{payload.action}</dd>
    <dt>expiresIn</dt><dd>{payload.expiresIn}</dd>
    <dt>link</dt><dd><a href={payload.token}>Follow Link</a></dd>
    <dt>token</dt><dd>{payload.token}</dd>

  </dl>

export const TestToken = () => {
  const [link, setLink] = useState('')
  const [refresh, setRefresh] = useState(0)
  const payload = {
    landingUrl: '/api/token',
    redirectUrl: '/test/test-token',
    data: JSON.stringify({
      msg: 'came here to do this',
      count: refresh
    }),
    action: 'log',
    expiresIn: '2h'
  }
  useEffect(() => {
    async function fetchData () {
      try {
        const data = await callApi(`token/log?${queryString.stringify(payload)}`)
        setLink(data)
      } catch (e) {
        console.error('getToken:', e)
      }
    }
    fetchData()
  }, [refresh])

  const handleClick = () => {
    setRefresh(refresh + 1)
  }
  return (
    <FullPage>
      <Payload payload={link}>{link}</Payload>
      <button onClick={handleClick}>Refresh Token URL</button>
    </FullPage>
  )
}
export default TestToken
