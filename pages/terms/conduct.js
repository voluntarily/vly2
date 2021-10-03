import React from 'react'
import Head from 'next/head'
import { injectIntl } from 'react-intl'
import ConductEn from '../../assets/notices/conduct-en.md'
import { A4 } from '../../components/VTheme/VTheme'


const Conduct = () =>
  <A4>
    <Head>
      <title>Code of Conduct - Voluntarily</title>
    </Head>
    <ConductEn />
  </A4>

export const ConductTest = Conduct // for test

export default injectIntl(Conduct)
