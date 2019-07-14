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
  const actMenuContent = {
    'Discover': {
      'Top rated': 132,
      'Top trending': 150
    },
    'Categories': {
      'Science': 91312,
      'Programming': 1312,
      'Geology': 1312,
      'Ballet': 1239
    }
  }
  const menu = Object.entries(actMenuContent).reduce((prev, [heading, subheadings]) => {
      // Add header
      prev.push(<Menu.ItemGroup>{heading}</Menu.ItemGroup>)

      Object.entries(subheadings).forEach(([subheading, count]) => {
        prev.push(<Menu.ItemGroup className='subheading color'>{subheading}</Menu.ItemGroup>);
      });

      return prev;
    }, []);

  return (
    <TagMenu>
      <Menu
      style={{ width: 256 }}
      mode="inline"
      >
        {menu}
        <Menu.ItemGroup className='color'>More filters</Menu.ItemGroup>
      </Menu>
    </TagMenu>
  )
}

export default ActMenu
