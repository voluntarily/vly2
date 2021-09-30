import { Menu } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import { useWindowSize } from '../../lib/useWindowSize'
import { useRouter } from 'next/router'

const { SubMenu, Item } = Menu
const VMenu = styled(Menu)`
  border-bottom: 2px solid transparent;
  border-right: none;
  font-weight: 700;
  .ant-menu-item {
    border: none;
    
  }

  @media screen and (max-width: 767px) {
      // display: none;
    }
`
export const NavigationH = ({ items }) => {
  const router = useRouter()
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
          {item.href.startsWith('http')
            ? ( // offsite links
              <a key={item.href} href={item.href}>{item.text}</a>
            ) : (
              <Link key={item.href} href={item.href}>
                <a>{item.text}</a>
              </Link>
            )}
        </Menu.Item>
      ))}

    </VMenu>
  )
}
export const NavigationV = ({ items }) => {
  const router = useRouter()
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
        title='Menu'
        style={{ textAlign: 'right', fontWeight: '700' }}
      >
        {items.map(item => (
          <Item key={item.key}>
            {item.href.startsWith('http')
              ? ( // offsite links
                <a key={item.href} href={item.href}>{item.text}</a>
              ) : (
                <Link key={item.href} href={item.href}>
                  <a>{item.text}</a>
                </Link>
              )}
          </Item>
        ))}
      </SubMenu>

    </VMenu>
  )
}

// useWindowSize is giving angry warnings from the SSR.
const COLLAPSE_MENU_WIDTH = 1020
export const Navigation = (props) => {
  const [width] = useWindowSize()
  return (width < COLLAPSE_MENU_WIDTH && width !== 0)
    ? <NavigationV {...props} />
    : <NavigationH {...props} />
}
// export const Navigation = NavigationH

export default NavigationH
