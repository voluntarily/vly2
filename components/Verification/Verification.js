import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx'
import { Modal, Button } from 'antd'
import VerifyButton from './VerifyButton'
import PropTypes from 'prop-types'
import { errorTitle, errorBody, codeOfConductTitle } from './Verification.messages'
import { ErrorRedirectUrlQuery } from '../../server/api/personalVerification/personalVerification.constants'
import codeOfConduct from './verification.codeofconduct-md-en.js'

const Verification = (props) => {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  useEffect(() => {
    if (router.asPath.includes(ErrorRedirectUrlQuery)) {
      setErrorModalOpen(true)
      const newUrl = (router.asPath || '' ).replace(`&${ErrorRedirectUrlQuery}`, '')
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
        title={codeOfConductTitle}
        visible={modalOpen}
        onOk={() => handleConfirmModal()}
        okButtonProps={({ type: 'primary' })}
        onCancel={() => setModalOpen(false)}
      >
        <Markdown children={codeOfConduct()} />
      </Modal>

      <Modal
        title={errorTitle}
        visible={errorModalOpen}
        closable={false}
        footer={[
          <Button key='submit' type='primary' onClick={handleErrorModalClose}>
            Ok
          </Button>
        ]}
      >
        <p>{errorBody}</p>
      </Modal>
    </section>
  )
}

Verification.propTypes = {
  meid: PropTypes.string.isRequired
}

export default Verification
