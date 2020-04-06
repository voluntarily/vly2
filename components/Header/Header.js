// import { FormattedMessage } from 'react-intl'
import { Avatar, Icon, Layout } from 'antd'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { HeaderMenu, MenuShowState } from './HeaderMenu'
import { useIntl } from 'react-intl'
import { Role } from '../../server/services/authorize/role.js'
import { useSelector } from 'react-redux'

const Brand = styled.h1`
  font-weight: 300;
  font-size: 2em;
  float: left;
`
const Notice = styled.div`
  font-weight: 600;
  font-size: 1.2em;
  width: 100%;
  background-color: blanchedalmond;
  padding-left: 1rem;
`

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const Logo = styled.img`
  height: 3rem;
  width: 12rem;
  margin: 0.7rem;

  background-image: url('/static/vlogolong.svg');
  background-repeat: no-repeat;
  background-position: center;

  @media screen and (max-width: 767px) {
    width: 2rem;
    background-image: url('/static/vlogo.svg');  
  }
`

const StyledAvatar = styled(Avatar)`
  background-color: #fff;
  margin: 0.5rem 1rem 0 0;
  @media screen and (max-width: 767px) {
    display: none;
  }
  .anticon-user {
    margin-right: 0px;
  }

  .ant-imgUrl > i {
    margin-right: 0px;
  }
`
// eslint-disable-next-line no-unused-vars
const Header = () => {
  const intl = useIntl()
  const me = useSelector(state => state.session.me)
  const isAuthenticated = useSelector(state => state.session.isAuthenticated)
  let notice = intl.formatMessage({ id: 'notice', defaultMessage: 'none' })
  if (notice === 'none') notice = '' // wipe notice if its set to none
  const height = '56px'
  const headerColor = isAuthenticated ? me.role.includes(Role.SUPPORT) ? 'solid 10px #faad14' : me.role.includes(Role.ADMIN) ? 'solid 10px #7826ff' : 'none' : 'none'
  const headerStyle = {
    borderTop: headerColor,
    position: 'fixed',
    height,
    zIndex: 10,
    width: '100%',
    backgroundColor: 'white'
  }

  let state = MenuShowState.ANON
  if (isAuthenticated) state = MenuShowState.AUTH
  if (me.role.includes(Role.VOLUNTEER)) state = MenuShowState.VOLUNTEER
  if (me.role.includes(Role.ADMIN) || me.role.includes(Role.SUPPORT)) state = MenuShowState.ADMIN
  return (
    <Layout.Header style={headerStyle}>
      {notice && <Notice style={{ position: 'fixed', bottom: '0' }}><Icon type='warning' /> {notice}</Notice>}
      <MenuGrid>
        <a href='/landing'><Logo src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' alt='Voluntarily logo' /></a>
        <div>
          <HeaderMenu state={state} />
        </div>
        {isAuthenticated &&
          <StyledAvatar>
            <Link href='/home'>
              <Avatar
                size='small'
                src={me.imgUrlSm}
                icon='user'
                alt='profile photo'
              />
            </Link>
          </StyledAvatar>}
      </MenuGrid>
    </Layout.Header>
  )
}

export default Header
