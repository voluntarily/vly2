import styled from 'styled-components'
import { TextHeadingBlack, SpacerSmall } from '../VTheme/VTheme'
import { Menu, Icon } from 'antd'
import { FormattedMessage } from 'react-intl'

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
    <TextHeadingBlack>
      <FormattedMessage
        id='home.title'
        defaultMessage='My Stuff'
        description='title on volunteer home page.'
      />
    </TextHeadingBlack>
    <SpacerSmall />
    <SpacerSmall />
    <SpacerSmall />
    <Menu mode='horizontal'>
      <Menu.Item key='1'>
        <Icon type='appstore' />
        <FormattedMessage
          id='home.ops'
          defaultMessage='Active Requests'
          description='show opportunities list on volunteer home page'
        />
      </Menu.Item>
      <Menu.Item key='2'>
        <Icon type='search' />
        <FormattedMessage
          id='home.search'
          defaultMessage='Search'
          description='show Search on volunteer home page'
        />
      </Menu.Item>
      <Menu.Item key='profile'>
        <Icon type='setting' />
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
