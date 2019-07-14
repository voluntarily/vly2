/* Display a grid of opanisation cards from an [op]
 */
import React from 'react'
import styled from 'styled-components'

import { Menu } from 'antd';

const TagMenu = styled(Menu)`
  height: 32px;
  width: 240px;
  font-family: Inter;
  font-size: 24px;
  letter-spacing: -0.3px;
  line-height: 48px;

  .subheading {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: -0.2px;
  }

  .color {
    color: #653CAD;
  }
`

const ActMenu = ({ acts, ...props }) => {
  const tagCounts = {
    Science: 91312,
    Programming: 1312,
    Geology: 1312,
    Ballet: 1239
  }
  const discoverSubheadings = {
    'Top rated': 132,
    'Top trending': 150
  }
  const menuMaker = (subheadings) => {
    const subheadingTitles = Object.keys(subheadings)
     return subheadingTitles.map(title => <Menu.ItemGroup className='subheading color'>{title} ({subheadings[title]})</Menu.ItemGroup>)
  }
  return (
    <TagMenu>
      <Menu
      style={{ width: 256 }}
      mode="inline"
      >
        <Menu.ItemGroup>Discover</Menu.ItemGroup>
        {menuMaker(tagCounts)}

        <Menu.ItemGroup>Categories</Menu.ItemGroup>
        {menuMaker(discoverSubheadings)}

        <Menu.ItemGroup className='color'>More filters</Menu.ItemGroup>
      </Menu>
    </TagMenu>
  )
}

export default ActMenu
