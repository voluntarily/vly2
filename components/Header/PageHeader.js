import styled from 'styled-components'
import { TextHeadingBlack, SpacerSmall } from '../VTheme/VTheme'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const ItemContainer = styled.div``


const BigBlackLine = styled.div`
width: 80rem;
height: 0.5rem;
border-radius:120px;
background-color: #e3e3e3;
`


const PageHeader = () => (
  <ItemContainer>
    <TextHeadingBlack>Activities</TextHeadingBlack>
    <SpacerSmall />
    <SpacerSmall />
    <SpacerSmall />
    <Menu mode='horizontal'>
      <Menu.Item key='mail'>
        <Icon type='appstore' />
        Activities
      </Menu.Item>
      <Menu.Item key='app'>
        <Icon type='appstore' />
        Bookmarked Activities
      </Menu.Item>
      <Menu.Item key='aaa'>
        <Icon type='setting' />
        Settings
      </Menu.Item>

    </Menu>
    <BigBlackLine />
  </ItemContainer>
)

export default PageHeader
