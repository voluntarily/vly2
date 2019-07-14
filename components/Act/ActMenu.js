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
  const discoverCounts = Object.keys(discoverSubheadings)
  const tags = Object.keys(tagCounts)
  return (
    <TagMenu>
      <Menu
      style={{ width: 256 }}
      mode="inline"
      >
        <Menu.ItemGroup>Discover</Menu.ItemGroup>
        {discoverCounts.map(d => <Menu.ItemGroup className='subheading color'>{d} ({discoverSubheadings[d]})</Menu.ItemGroup>)}

        <Menu.ItemGroup>Categories</Menu.ItemGroup>
        {tags.map(tag => <Menu.ItemGroup className='subheading color'>{tag} ({tagCounts[tag]})</Menu.ItemGroup>)}
        <Menu.ItemGroup className='color'>More filters</Menu.ItemGroup>
      </Menu>
    </TagMenu>
  )
}

export default ActMenu
