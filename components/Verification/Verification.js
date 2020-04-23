import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Modal, Button } from 'antd'
import VerifyButton from './VerifyButton'
import { errorTitle, errorBody, successBody, successTitle } from './Verification.messages'
import { VerificationResultUrlQueryParam } from '../../server/api/personalVerification/personalVerification.constants'

const Verification = () => {
  const router = useRouter()
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)

  useEffect(() => {
    if (router.asPath.includes(`${VerificationResultUrlQueryParam}=false`)) {
      setErrorModalOpen(true)
      const newUrl = router.asPath.replace(`&${VerificationResultUrlQueryParam}=false`, '')
      router.replace(router.asPath, newUrl, { shallow: true })
    }

    if (router.asPath.includes(`${VerificationResultUrlQueryParam}=true`)) {
      setSuccessModalOpen(true)
      const newUrl = router.asPath.replace(`&${VerificationResultUrlQueryParam}=true`, '')
      router.replace(router.asPath, newUrl, { shallow: true })
    }
  })

  return (
    <>
      <VerifyButton onClick={() => router.push('/verification/conduct')} />
      <Modal
        title={errorTitle}
        visible={errorModalOpen}
        closable={false}
        footer={[
          <Button key='submit' type='primary' onClick={() => setErrorModalOpen(false)}>
            Ok
          </Button>
        ]}
      >
        <p>{errorBody}</p>
      </Modal>

      <Modal
        title={successTitle}
        visible={successModalOpen}
        closable={false}
        footer={[
          <Button key='submit' type='primary' onClick={() => setSuccessModalOpen(false)}>
            Ok
          </Button>
        ]}
      >
        <p>{successBody}</p>
      </Modal>
    </>
  )
}

export default Verification
