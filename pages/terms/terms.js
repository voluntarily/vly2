import React from 'react'
import { Helmet } from 'react-helmet'
import { injectIntl } from 'react-intl'
import TermsEn from '../../assets/notices/terms-en.md'
import { A4 } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'

const Terms = () =>
  <A4>
    <Helmet>
      <title>Terms of Use - Voluntarily</title>
    </Helmet>
    <TermsEn />
  </A4>

export const TermsTest = Terms // for test

export default publicPage(injectIntl(Terms))
