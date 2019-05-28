import styled from 'styled-components'
import { TextHeadingBlack, SpacerSmall } from '../VTheme/VTheme'
import { Menu, Icon } from 'antd'

const ItemContainer = styled.div``

const BigBlackLine = styled.div`
width: 80rem;
height: 0.5rem;
border-radius:120px;
background-color: #e3e3e3;
@media screen and (min-width: 768px) and (max-width: 1280px) {
    width: calc(100vw - 6rem);
  }

  @media screen and (max-width: 767px) {
    width: calc(100vw - 4rem);
  }

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
