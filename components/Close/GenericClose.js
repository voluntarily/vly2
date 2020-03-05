import { HalfGrid } from '../VTheme/VTheme'
import CloseCard from './CloseActionCard'
import { Divider } from 'antd'
import styled from 'styled-components'
const CloseGrid = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 5rem;
max-width: 1280px;
`

const SmallHeader = styled.small`
color: #333;
font-size: 1rem;
`

const GenericClose = () => (
  <CloseGrid>
    <img src='https://picsum.photos/640/480' />
    <div>
      <SmallHeader>Activity created</SmallHeader>
      <h2>Volunteers can now see your activity and offer to help you out! 🥳</h2>
      <Divider />
      <h4>Try the following things next:</h4>
      <CloseCard imgLink='static/img/icons/invite.svg' link='#' />

    </div>
  </CloseGrid>
)

export default GenericClose
