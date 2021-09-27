import React from 'react'
import { Helmet } from 'react-helmet'
import { injectIntl } from 'react-intl'
import PrivacyEn from '../../assets/notices/privacy-full-en.md'
import { A4 } from '../../components/VTheme/VTheme'


const Privacy = () =>
  <A4>
    <Helmet>
      <title>Privacy Policy - Voluntarily</title>
    </Helmet>
    <PrivacyEn />
  </A4>

export const PrivacyTest = Privacy // for test

export default injectIntl(Privacy)
