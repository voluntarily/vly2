import React, { useState, useEffect } from 'react'
import { useRouter, Router } from 'next/router'
import { Modal, Button } from 'antd'
import VerifyButton from './VerifyButton'
import PropTypes from 'prop-types'
import { ErrorRedirectUrlQuery } from '../../server/api/personalVerification/personalVerification.constants'

const Verification = (props) => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  useEffect(() => {
    if (router.asPath.includes(ErrorRedirectUrlQuery)) {
      setErrorModalOpen(true)
      const newUrl = router.asPath.replace(`&${ErrorRedirectUrlQuery}`, '')
      router.replace(router.asPath, newUrl, { shallow: true })
    }
  })

  const handleConfirmModal = async () => {
    const redirectUrl = `/api/verify?meid=${props.meid}`
    router.push(redirectUrl)
    setModalOpen(false)
  }

  const handleErrorModalClose = () => {
    setErrorModalOpen(false)
  }

  return (
    <section>
      <VerifyButton onClick={() => setModalOpen(true)} />
      <Modal
        title='Code of Conduct'
        visible={modalOpen}
        onOk={() => handleConfirmModal()}
        okButtonProps={({ type: 'primary' })}
        onCancel={() => setModalOpen(false)}
      >
        <h1>Being a great volunteer </h1>
        <p>
            In order to support safety and trust in our community,
                    we have a code of conduct all volunteers need to follow in your heart. This
                    code sets out principles and behaviours that the Voluntarily community reasonably
                    expects of people participating in voluntarily activities.
        </p>
        <h3>Basic Principles</h3>
        <p>The community expects volunteers to:</p>
        <ul>
          <li>Conduct themselves honestly and in good faith at all times. </li>
          <li>Comply with all laws, including sale of goods and intellectual property laws. </li>
          <li>Comply with Voluntariliy’s terms and conditions.</li>
          <li>Accept the full Code of Conduct and Terms of Use</li>
        </ul>
      </Modal>

      <Modal
        title='Sorry something went wrong'
        visible={errorModalOpen}
        footer={[
          <Button key='submit' type='primary' onClick={handleErrorModalClose}>
            Ok
          </Button>
        ]}
      >
        <p>Ohh... we really apologise but something went wrong during the verification. Would you mind trying it again after some time?</p>
      </Modal>
    </section>
  )
}

Verification.propTypes = {
  meid: PropTypes.string.isRequired
}

export default Verification
