import React from 'react'
import { Helmet } from 'react-helmet'
import { injectIntl } from 'react-intl'
import ConductEn from '../../assets/notices/conduct-en.md'
import { A4 } from '../../components/VTheme/VTheme'
import publicPage from '../../hocs/publicPage'

const Conduct = () =>
  <A4>
    <Helmet>
      <title>Code of Conduct - Voluntarily</title>
    </Helmet>
    <ConductEn />
  </A4>

export const ConductTest = Conduct // for test

export default publicPage(injectIntl(Conduct))
