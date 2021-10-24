import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { Menu, Layout } from 'antd'

import { MenuOutlined, WarningOutlined } from '@ant-design/icons'
import { headerMenu, MenuShowState } from './HeaderMenu'
import { Role } from '../../server/services/authorize/role.js'

const VMenu = styled(Menu)`
  // border-bottom: 2px solid transparent;
  // border-right: none;
  // font-weight: 700;
  // .ant-menu-item {
  //   border: none;
  // }

`

const Notice = styled.div`
  font-weight: 600;
  font-size: 1.2em;
  width: 100%;
  background-color: blanchedalmond;
  padding-left: 1rem;
`

const Logo = styled.img`
  height: 2rem;
  width: 12rem;

  background-image: url('/static/vlogolong.svg');
  background-repeat: no-repeat;
  background-position: left top;
  @media screen and (max-width: 767px) {
    background-image: url('/static/vlogo.svg');
    width: 2rem;
  }
`

const Header = () => {
  const intl = useIntl()
  const router = useRouter()
  const me = useSelector(state => state.session.me)
  const isAuthenticated = useSelector(state => state.session.isAuthenticated)
  const [menuState, setMenuState] = useState(MenuShowState.ANON)

  useEffect(() => {
    let state = isAuthenticated ? MenuShowState.AUTH : MenuShowState.ANON
    if (me.role.includes(Role.BASIC)) state = MenuShowState.BASIC
    if (me.role.includes(Role.VOLUNTEER)) state = MenuShowState.VOLUNTEER
    if (me.role.includes(Role.VOLUNTEER) && me.role.includes(Role.BASIC)) state = MenuShowState.BOTH
    if (me.role.includes(Role.ADMIN) || me.role.includes(Role.SUPPORT)) state = MenuShowState.ADMIN
    setMenuState(state)
  }, [me, isAuthenticated])

  let notice = intl.formatMessage({ id: 'notice', defaultMessage: 'none' })
  if (notice === 'none') notice = '' // wipe notice if its set to none
  const height = '56px'
  const headerColor = isAuthenticated
    ? me.role.includes(Role.SUPPORT)
        ? 'solid 10px #faad14'
        : me.role.includes(Role.ADMIN)
          ? 'solid 10px #7826ff'
          : 'none'
    : 'none'
  const headerStyle = {
    borderTop: headerColor,
    position: 'fixed',
    height,
    zIndex: 1000000,
    width: '100%',
    backgroundColor: 'black'
  }

  const activeItem = router.pathname.slice(1)

  const menuItems = useMemo(() => headerMenu(menuState), [menuState])

  return (
    <Layout.Header style={headerStyle}>

      <VMenu
        theme='light'
        mode='horizontal'
        selectedKeys={[activeItem]}
        overflowedIndicator={<MenuOutlined />}
      >
        <Menu.Item key='voluntarily'>
          <Link href='/landing'>
            <a>
              <Logo
                src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
                alt='Voluntarily logo'
              />
            </a>
          </Link>
        </Menu.Item>
        {menuItems.map(item => (
          <Menu.Item key={item.key}>
            {
            item.href.startsWith('http')
              ? <a key={item.href} href={item.href}>{item.text}</a>
              : (
                <Link key={item.href} href={item.href} as={item.href}>
                  <a>{item.text}</a>
                </Link>)
          }
          </Menu.Item>
        ))}
        {/* {isAuthenticated &&
          <Menu.Item key='avatar'>
            <StyledAvatar>
              <Link href='/home' passHref>
                <Avatar
                  size='small'
                  src={me.imgUrlSm}
                  icon={<UserOutlined />}
                  alt='profile photo'
                />
              </Link>
            </StyledAvatar>
          </Menu.Item>
        } */}
      </VMenu>

      {notice && <Notice style={{ position: 'fixed', bottom: '0' }}><WarningOutlined /> {notice}</Notice>}
    </Layout.Header>
  )
}

export default Header
