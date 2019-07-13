/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd';

const ActMenu = ({ acts, ...props }) => (
    <div>
      <Menu
      style={{ width: 256 }}
      mode="inline"
      >
        <Menu.ItemGroup key="g1" title="Discover">
          <Menu.Item key="1">Top rated</Menu.Item>
          <Menu.Item key="2">Top trending</Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key="g2" title="Categories">
          <Menu.Item key="3">Science</Menu.Item>
          <Menu.Item key="4">Programming</Menu.Item>
          <Menu.Item key="5">Geology</Menu.Item>
        </Menu.ItemGroup>
    </Menu>
  </div>
)

ActMenu.practTypes = {
  acts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
      imgUrl: PropTypes.any,
      duration: PropTypes.string
    })
  ) // optional
}

export default ActMenu
