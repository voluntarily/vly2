import { Menu } from 'antd'
import Link from 'next/link'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useWindowSize } from '../../lib/useWindowSize'
const { SubMenu, Item } = Menu
const VMenu = styled(Menu)`
border-bottom: 2px solid transparent;
border-right: none;
.ant-menu-item {
  border: none;
  
}

@media screen and (max-width: 767px) {
    // display: none;
  }
`
export const NavigationH = ({ items, router }) => {
  const activeItem = router.pathname.slice(1)
  return (
    <VMenu
      theme='light'
      mode='horizontal'
      style={{ float: 'right' }}
      selectedKeys={[activeItem]}
    >
      {items.map(item => (
        <Menu.Item key={item.key}>
          <Link key={item.href} href={item.href}>
            <a>{item.text}</a>
          </Link>
        </Menu.Item>
      ))}

    </VMenu>
  )
}
export const NavigationV = ({ items, router }) => {
  const activeItem = router.pathname.slice(1)
  return (
    <VMenu
      theme='light'
      mode='inline'
      // style={{ float: 'right' }}
      selectedKeys={[activeItem]}
    >
      <SubMenu
        key='sub1'
        title='☰'
      >
        {items.map(item => (
          <Item key={item.key}>
            <Link key={item.href} href={item.href}>
              <a>{item.text}</a>
            </Link>
          </Item>
        ))}
      </SubMenu>

    </VMenu>
  )
}

const COLLAPSE_MENU_WIDTH = 767
const Navigation = (props) => {
  const [width] = useWindowSize()
  return (width < COLLAPSE_MENU_WIDTH)
    ? <NavigationV {...props} />
    : <NavigationH {...props} />
}

Navigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      url: PropTypes.string
    })
  ),
  defaultItem: PropTypes.string
}

export default withRouter(Navigation)
