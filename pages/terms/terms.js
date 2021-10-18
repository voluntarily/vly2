import React from 'react'
import Head from 'next/head'
import { injectIntl } from 'react-intl'
import TermsEn from '../../assets/notices/terms-en.md'
import { A4 } from '../../components/VTheme/VTheme'

const Terms = () =>
  <A4>
    <Head>
      <title>Terms of Use - Voluntarily</title>
    </Head>
    <TermsEn />
  </A4>

export const TermsTest = Terms // for test

export default injectIntl(Terms)
