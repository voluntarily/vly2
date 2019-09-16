import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Button, Modal, Select } from 'antd'
import { config } from '../../config/config'

const { Option } = Select

const setAvailableBadgeData = async (setBadge) => {
  const response = await window.fetch(`${config.appUrl}/api/badges`)
  const data = await response.json()
  setBadge(data)
}

function IssueBadge ({ person }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [data, setBadge] = useState([{}])
  const [currentBadgeChosen, setBadgeChosen] = useState({})
  useEffect(() => {
    setAvailableBadgeData(setBadge)
  }, [person])

  const handleOk = async () => {
    const { _id, email } = person
    const body = {
      _id,
      email
    }
    const { entityId } = currentBadgeChosen
    await window.fetch(`${config.appUrl}/api/badge/${entityId}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    setModalVisible(false)
    Router.push(`${config.appUrl}/people/${_id}`)
  }
  return (
    <div>
      <Button onClick={() => setModalVisible(!modalVisible)}>Issue Badge</Button>
      <Modal
        title='Select badge to issue to this person'
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}>
        <BadgeList badgeList={data} setBadgeChosen={setBadgeChosen} />
      </Modal>
    </div>
  )
}

function BadgeList ({ badgeList, setBadgeChosen }) {
  const handleOptionChange = (e) => {
    const badgeChoosen = badgeList[e]
    setBadgeChosen(badgeChoosen)
  }
  return (
    <Select placeholder='Please select' style={{ width: '100%' }} onChange={handleOptionChange}>
      {
        badgeList.map((badge, key) => {
          return (<Option key={key} >{badge.name}</Option>)
        })
      }
    </Select>
  )
}

export const IssueBadgeButton = IssueBadge
