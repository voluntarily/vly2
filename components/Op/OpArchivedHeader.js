import styled from 'styled-components'
import { Icon, Alert } from 'antd'
import Link from 'next/link'

const HeaderContainer = styled.div`
width: 100%;
padding: 1.5rem;
border-radius: 8px;

display: grid;
grid-template-columns: 3rem 1fr;

background-color: #222222;

h4 {
    color: white;
}

`

const HeaderTest = styled.div`
margin-bottom: -4rem;

`


const IconContainer = styled.div`
align-self: center;
`

const TextContainer = styled.div`

margin-bottom: 0;
margin-top: 0rem;
`
const headerMessage = 'This activity happened in the past, but you can still get involved with similar activities here'


const OpArchivedHeader = ({ date }) => (

    <HeaderTest>
    
<HeaderContainer>
<IconContainer><Icon type="history" style={{ fontSize: '32px', color: 'white' }} /></IconContainer>
<TextContainer><h4>This activity has already happened, but you can still get involved with  <Link href='/'><a style={{ color: '#CFBCF2' }}>similar activities here</a></Link></h4></TextContainer>
</HeaderContainer>
 {/* <Alert message={headerMessage} type="success" showIcon /> */}

</HeaderTest>

)

export default OpArchivedHeader