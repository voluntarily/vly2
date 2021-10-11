import PageTitle from '../Landing/PageTitle.js'
import { OpTypeImperative } from './OpType'
import { BackButton } from '../VTheme/Buttons'
import styled from 'styled-components'

// 20% left, 80% right two column
export const BackAndTitle = styled.div`
  display: grid;
  position: relative;
  margin: 0;
  grid-template-columns: 8rem 1fr;
  grid-column-gap: 2rem;
`

const MiddleButton = styled.div`
  border-right: 1px solid #aaa;
  padding-right: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`
export const OpFormTitle = ({ type, title, onBack }) => {
  return (
    <PageTitle>
      <BackAndTitle>
        <MiddleButton><BackButton onClick={onBack} /></MiddleButton>
        <div>
          <h1>
            <OpTypeImperative type={type} />
          </h1>
          <h2>
            {title}
          </h2>
        </div>
      </BackAndTitle>
    </PageTitle>
  )
}
export default OpFormTitle
