import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { Button, Modal, Select } from 'antd'
import callApi from '../../lib/apiCaller'
import { config } from '../../config/config'

const { Option } = Select

export const IssueBadgeButton = IssueBadge

function IssueBadge ({ person }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalButtonIsLoading, setModalButtonLoading] = useState(false)
  const [badgeList, setBadgeList] = useState([{}])
  const [currentBadgeChosen, setBadgeChosen] = useState({})
  useEffect(() => {
    setAvailableBadgeData(setBadgeList)
  }, [person])

  const handleOk = async () => {
    setModalButtonLoading(!modalButtonIsLoading)
    const { entityId } = currentBadgeChosen
    await sendIssuingBadgeRequest(person, entityId)
    setModalVisible(false)
    setModalButtonLoading(!modalButtonIsLoading)
  }
  return (
    <div>
      <Button onClick={() => setModalVisible(!modalVisible)} shape='round'>Issue Badge</Button>
      <Modal
        title='Select badge to issue to this person'
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={modalButtonIsLoading}
        onCancel={() => setModalVisible(false)}>
        <BadgeList badgeList={badgeList} setBadgeChosen={setBadgeChosen} />
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

const setAvailableBadgeData = async (setBadgeList) => {
  const badgeList = await callApi(`badges`)
  setBadgeList(badgeList)
}

const sendIssuingBadgeRequest = async ({ _id, email }, badgeId) => {
  const body = {
    _id,
    email
  }
  await callApi(`badge/${badgeId}`, 'POST', body)
  Router.push(`/people/${_id}`)
}
