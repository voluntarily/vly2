import { HalfGrid } from '../VTheme/VTheme'
import CloseCard from './CloseActionCard'
import { Divider } from 'antd'

const GenericClose = () => (
  <HalfGrid>
    <img src='https://picsum.photos/640/480' />
    <div>
      <h2>Welcome to Voluntarily!</h2>
      <Divider />
      <h3>Try the following things next:</h3>
      <CloseCard />
    </div>
  </HalfGrid>
)

export default GenericClose
