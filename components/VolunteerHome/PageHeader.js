import { AppstoreOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { H3Black, SpacerSmall } from '../VTheme/VTheme'

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
    <H3Black>
      <FormattedMessage
        id='home.name'
        defaultMessage='My Stuff'
        description='title on volunteer home page.'
      />
    </H3Black>
    <SpacerSmall />
    <SpacerSmall />
    <SpacerSmall />
    <Menu mode='horizontal'>
      <Menu.Item key='1'>
        <AppstoreOutlined />
        <FormattedMessage
          id='home.ops'
          defaultMessage='Active Requests'
          description='show opportunities list on volunteer home page'
        />
      </Menu.Item>
      <Menu.Item key='2'>
        <SearchOutlined />
        <FormattedMessage
          id='home.search'
          defaultMessage='Search'
          description='show Search on volunteer home page'
        />
      </Menu.Item>
      <Menu.Item key='profile'>
        <SettingOutlined />
        <FormattedMessage
          id='home.profile'
          defaultMessage='Profile'
          description='show profile on volunteer home page'
        />
      </Menu.Item>

    </Menu>
    <BigBlackLine />
  </ItemContainer>
)

export default PageHeader
