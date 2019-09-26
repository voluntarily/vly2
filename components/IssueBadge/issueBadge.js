import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Button, Modal, Select } from 'antd'
import callApi from '../../lib/apiCaller'
import { config } from '../../config/config'

const { Option } = Select

export const IssueBadgeButton = IssueBadge

function IssueBadge ({ person }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [data, setBadge] = useState([{}])
  const [currentBadgeChosen, setBadgeChosen] = useState({})
  useEffect(() => {
    setAvailableBadgeData(setBadge)
  }, [person])

  const handleOk = async () => {
    const { entityId } = currentBadgeChosen
    sendIssuingBadgeRequest(person, entityId)
    setModalVisible(false)
  }
  return (
    <div>
      <Button onClick={() => setModalVisible(!modalVisible)} shape='round'>Issue Badge</Button>
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

const setAvailableBadgeData = async (setBadge) => {
  const data = await callApi(`badges`)
  setBadge(data)
}

const sendIssuingBadgeRequest = async ({ _id, email }, badgeId) => {
  const body = {
    _id,
    email
  }
  await callApi(`badge/${badgeId}`, 'POST', body)
  Router.push(`${config.appUrl}/people/${_id}`)
}
