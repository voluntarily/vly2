import React, { useState } from 'react'
import Router from 'next/router'
import { Modal } from 'antd'
import VerifyButton from './VerifyButton'
import PropTypes from 'prop-types'

const Verification = (props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  // useEffect(() => {
  //   setErrorModalOpen(Router.asPath.includes('verificatonError=true'))
  // })

  const handleConfirmModal = async () => {
    const signThruUrl = `/api/verify?meid=${props.meid}`
    Router.push(signThruUrl)
    setModalOpen(false)
  }

  return (
    <section>
      <VerifyButton onClick={() => setModalOpen(true)} />
      <Modal
        title='Code of Conduct'
        visible={modalOpen}
        onOk={() => handleConfirmModal()}
        okButtonProps={({ type: 'promary' })}
        onCancel={() => setModalOpen(false)}
      >
        <h1>Being a great volunteer </h1>
        <p>
            In order to support safety and trust in our community,
                    we have a code of conduct all volunteers need to follow in your heart. This
                    code sets out principles and behaviours that the Voluntarily community reasonably
                    expects of people participating in voluntarily activities.
        </p>
        {Router.asPath}
        <h3>Basic Principles</h3>
        <p>The community expects volunteers to:
          <ul>
            <li>Conduct themselves honestly and in good faith at all times. </li>
            <li>Comply with all laws, including sale of goods and intellectual property laws. </li>
            <li>Comply with Voluntariliy’s terms and conditions.</li>
            <li>Accept the full Code of Conduct and Terms of Use</li>
          </ul>
        </p>
      </Modal>
      {
        errorModalOpen && Modal.error({
          title: 'Sorry something went wrong',
          content: 'Ohh... we really appologise but something went wrong during the verification. Would you mind trying it again after some time?',
          onClick: () => setErrorModalOpen(false)
        })
      }
    </section>
  )
}

Verification.propTypes = {
  meid: PropTypes.string.isRequired
}

export default Verification
