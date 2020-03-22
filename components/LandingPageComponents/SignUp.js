import React, { useState } from 'react'
import Router from 'next/router'
import { Button, Modal } from 'antd'

const SignUpButton = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalButtonIsLoading, setModalButtonLoading] = useState(false)

  const handleOk = async () => {
    setModalButtonLoading(!modalButtonIsLoading)
    await Router.push('/home')
    setModalVisible(false)
    setModalButtonLoading(!modalButtonIsLoading)
  }

  return (
    <div>
      <Button onClick={() => setModalVisible(!modalVisible)} type='primary' shape='round' size='large'>Sign Up</Button>
      <Modal
        title='How to sign up'
        visible={modalVisible}
        onOk={handleOk}
        okText='Continue'
        confirmLoading={modalButtonIsLoading}
        centered
        onCancel={() => setModalVisible(false)}
      >
        <div>After you click <i>Continue</i>, please choose from one of the Social Login options. This simplifies registrations
          and logins as it uses existing login information from a social network provider like Facebook, Twitter, or
          Google. If you would prefer to add your credentials manually, please select the <i>Sign Up</i> tab and enter
          your details in the fields provided.
        </div>
      </Modal>
    </div>
  )
}

export { SignUpButton }
