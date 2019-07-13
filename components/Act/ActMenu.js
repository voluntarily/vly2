/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Menu } from 'antd';

const ActivityNavHeading = styled.div`
  height: 32px;
  width: 240px;
  font-family: Inter;
  font-size: 24px;
  letter-spacing: -0.3px;
  line-height: 48px;
`
const ActivityNavSubheading = styled.div`
  color: #653CAD;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: -0.2px;
  line-height: 48px;
`

const ActMenu = ({ acts, ...props }) => (
  <ActivityNavHeading>
    <Menu
    style={{ width: 256 }}
    mode="inline"
    >
      <Menu.ItemGroup key="g1" title="Discover">
        <ActivityNavSubheading>
          <Menu.Item key="1">Top rated</Menu.Item>
          <Menu.Item key="2">Top trending</Menu.Item>
        </ActivityNavSubheading>
      </Menu.ItemGroup>
      <Menu.ItemGroup key="g2" title="Categories">
        <ActivityNavSubheading>
          <Menu.Item key="3">Science</Menu.Item>
          <Menu.Item key="4">Programming</Menu.Item>
          <Menu.Item key="5">Geology</Menu.Item>
        </ActivityNavSubheading>
      </Menu.ItemGroup>
    </Menu>
  </ActivityNavHeading>
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
