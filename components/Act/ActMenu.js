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
  const tags = Object.keys(tagCounts)
  return (
    <TagMenu>
      <Menu
      style={{ width: 256 }}
      mode="inline"
      >
        <Menu.ItemGroup key="g1">Discover</Menu.ItemGroup>
        <Menu.ItemGroup key="10" className='subheading color'>Top rated (132)</Menu.ItemGroup>
        <Menu.ItemGroup key="20" className='subheading color'>Top trending (132)</Menu.ItemGroup>
      
        <Menu.ItemGroup key="g2">Categories</Menu.ItemGroup>
        {tags.map((tag, i) => <Menu.ItemGroup key={i} className='subheading color'>{tag} {tagCounts[tag]}</Menu.ItemGroup>)}
        <Menu.ItemGroup key="6" className='color'>More filters</Menu.ItemGroup>
      </Menu>
    </TagMenu>
  )
}

export default ActMenu
