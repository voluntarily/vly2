import React from 'react'
import publicPage from '../../hocs/publicPage'
import IntlDemo from '../../components/examples/IntlDemo/intlDemo'

class TestIntl extends React.Component {
  render = () => {
    return <IntlDemo />
  }
}
export default publicPage(TestIntl)
// export default TestRedirect
