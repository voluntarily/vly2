import PropTypes from 'prop-types'
import Link from 'next/link'
import { withRouter } from 'next/router'
// import { connect } from 'react-redux';
import { Menu } from 'antd'
// import { toggleLoginForm } from '../../AppActions';

const Navigation = ({ items, defaultItem, router, ...props }) => {
  // TODO next js get the location is different?
  const activeItem = router && router.pathname ? router.pathname.slice(1) : defaultItem
  return (
    <Menu
      theme='dark'
      mode='horizontal'
      style={{ float: 'right' }}
      selectedKeys={[activeItem]}
    >
      {items.map(item => (
        <Menu.Item key={item.key}>
          <Link href={item.url}><a>{item.text}</a></Link>
        </Menu.Item>
      ))}
    </Menu>
  )
}

Navigation.defaultProps = {
  items: [],
  defaultItem: '',
  location: {}
  // toggleLoginForm: () => {}
}

Navigation.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    text: PropTypes.string,
    url: PropTypes.string
  })),
  defaultItem: PropTypes.string,
  location: PropTypes.object
  // toggleLoginForm: PropTypes.func,
}

export default withRouter(Navigation)
// const mapDispatchToProps = {
//   toggleLoginForm,
// };

// export default connect(null, mapDispatchToProps)(withRouter(Navigation));
