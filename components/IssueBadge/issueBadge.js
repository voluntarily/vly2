import React, { useState, useEffect } from 'React'
import { Button, Modal } from 'antd'
import { config } from '../../config/config'

const setAvailableBadgeData = async (setAvailableBadge) => {
  const data = await window.fetch(`${config.appUrl}/api/badges`).json()
  setAvailableBadge(data)
}

export default function issueBadge ({ person }) {
  const [availableBadge, setAvailableBadge] = useState([{}])

  useEffect(() => {
    setAvailableBadgeData(setAvailableBadge)
  })
  return (
    <div />
  )
}

export const IssueBadge = issueBadge
