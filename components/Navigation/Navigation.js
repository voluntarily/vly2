import { Avatar, Menu } from 'antd'
import Link from 'next/link'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledMenu = styled(Menu)`
  font-weight: bold;
  letter-spacing: -0.6px;
`
const StyledAvatar = styled(Avatar)`
  background-color: #fff;

  .anticon-user {
    margin-right: 0px;
  }

  .ant-imgUrl > i {
    margin-right: 0px;
  }
`

const Navigation = ({ items, defaultItem, router, me, ...props }) => {
  // TODO next js get the location is different?
  // const activeItem = router && router.pathname ? router.pathname.slice(1) : defaultItem
  const activeItem = router.pathname.slice(1)
  return (
    <StyledMenu
      theme='light'
      mode='horizontal'
      style={{ float: 'right' }}
      selectedKeys={[activeItem]}
    >
      {items.map(item => (
        <Menu.Item key={item.key}>
          {/* don't do prefetch during testing */}
          {/* // TODO: [VP-800] in menu if link is offset use A instead of Link to avoid Next warning */}
          <Link key={item.href} href={item.href}>
            <a>{item.text}</a>
          </Link>
        </Menu.Item>

      ))}
      <Menu.Item>
        <StyledAvatar>
          <Link href={me && me._id ? `/people/${me._id}` : 'auth/sign-in'}>
            <Avatar
              size='small'
              src={me && me.imgUrlSm}
              icon='user'
            />
          </Link>
        </StyledAvatar>
      </Menu.Item>
    </StyledMenu>
  )
}

Navigation.defaultProps = {
  items: [],
  defaultItem: ''
}

Navigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      text: PropTypes.string,
      url: PropTypes.string
    })
  ),
  defaultItem: PropTypes.string
}

export default withRouter(Navigation)
