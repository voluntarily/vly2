import styled from 'styled-components'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { Menu, Avatar } from 'antd'

const StyledMenu = styled(Menu)`
  font-weight: bold;
  letter-spacing: -0.6px;
`

const Navigation = ({ items, defaultItem, router, ...props }) => {
  // TODO next js get the location is different?
  // const activeItem = router && router.pathname ? router.pathname.slice(1) : defaultItem
  const activeItem = router.pathname.slice(1)
  return (
    <StyledMenu>
      <Menu
        theme='light'
        mode='horizontal'
        style={{ float: 'right' }}
        selectedKeys={[activeItem]}
      >
        {items.map(item => (
          <Menu.Item key={item.key}>
            {/* don't do prefetch during testing */}
            <Link key={item.href} href={item.href}>
              <a>{item.text}</a>
            </Link>
          </Menu.Item>

        ))}
        <Menu.Item>
          <Avatar
            icon='user'
            size='small'
            src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
          />
        </Menu.Item>
      </Menu>
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
