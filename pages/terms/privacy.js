import React from 'react'
import Head from 'next/head'
import { injectIntl } from 'react-intl'
import PrivacyEn from '../../assets/notices/privacy-full-en.md'
import { A4 } from '../../components/VTheme/VTheme'


const Privacy = () =>
  <A4>
    <Head>
      <title>Privacy Policy - Voluntarily</title>
    </Head>
    <PrivacyEn />
  </A4>

export const PrivacyTest = Privacy // for test

export default injectIntl(Privacy)
