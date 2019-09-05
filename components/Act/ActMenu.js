import { Menu } from 'antd'
import styled from 'styled-components'

const ActivityMenu = styled(Menu)`
  height: 32px;
  width: 240px;

  font-size: 24px;
  letter-spacing: -0.3px;
  line-height: 122px;

  .subheading {
    font-size: 16px;
    font-weight: bold;
    letter-spacing: -0.2px;
  }

  .color {
    color: #653cad;
  }
  @media screen and (max-width: 1280px) {
    display: none;
  }
`

const ActMenu = ({ acts, ...props }) => {
  // Trying to get tags data:
  // console.log(acts[1].tags[0])
  const actMenu = {
    Discover: {
      'Top rated': 132,
      'Top trending': 150
    },
    Categories: {
      Science: 91312,
      Programming: 1312,
      Geology: 1312,
      Ballet: 1239
    }
  }
  const renderMenu = Object.entries(actMenu).reduce(
    (prev, [heading, subheadings]) => {
      // Add headings
      prev.push(<Menu.ItemGroup>{heading}</Menu.ItemGroup>)

      // Add subheadings
      Object.entries(subheadings).forEach(([subheading, count]) => {
        prev.push(
          <Menu.ItemGroup className='subheading color'>
            {subheading} ({count})
          </Menu.ItemGroup>
        )
      })

      return prev
    },
    []
  )

  return (
    <ActivityMenu>
      <Menu style={{ width: 280, lineHeight: 1.2 }}>
        {renderMenu}
        <Menu.ItemGroup className='color'>More filters</Menu.ItemGroup>
      </Menu>
    </ActivityMenu>
  )
}

export default ActMenu
