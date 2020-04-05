import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Modal, Button } from 'antd'
import VerifyButton from './VerifyButton'
import PropTypes from 'prop-types'
import { errorTitle, errorBody } from './Verification.messages'
import { ErrorRedirectUrlQuery } from '../../server/api/personalVerification/personalVerification.constants'

const Verification = (props) => {
  const router = useRouter()
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  useEffect(() => {
    if (router.asPath.includes(ErrorRedirectUrlQuery)) {
      setErrorModalOpen(true)
      const newUrl = router.asPath.replace(`&${ErrorRedirectUrlQuery}`, '')
      router.replace(router.asPath, newUrl, { shallow: true })
    }
  })

  const handleErrorModalClose = () => {
    setErrorModalOpen(false)
  }

  return (
    <section>
      <VerifyButton onClick={() => router.push('/verification/codeofconduct')} />
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
