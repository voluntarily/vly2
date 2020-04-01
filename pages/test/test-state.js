import { A4 } from '../../components/VTheme/VTheme'
import LocalStateTest from '../../components/testredux/LocalStateTest.js'
import LocalUseStateTest from '../../components/testredux/LocalUseStateTest.js'
import ReduxStoreTest from '../../components/testredux/ReduxStoreTest'
import ReduxAsyncTest from '../../components/testredux/ReduxAsyncTest'

const Section = (props) =>
  <section>
    <h1>{props.title}</h1>
    {props.children}
    <hr />
  </section>

const TestReduxPage = () =>
  <A4>
    <Section title='Local State'><LocalStateTest /></Section>
    <Section title='Local Use State'><LocalUseStateTest /></Section>
    <Section title='Redux Store'><ReduxStoreTest /></Section>
    <Section title='Redux Async'><ReduxAsyncTest /></Section>
  </A4>

// export default publicPage(TestReduxPage)
export default TestReduxPage
