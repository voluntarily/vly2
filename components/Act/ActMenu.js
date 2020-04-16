import { Menu, Radio } from 'antd'
import styled from 'styled-components'

/**
 *
 * @param {*} acts - array of activities with offerOrg
 * @return Return array of counts and array of orgs .
 */
const countOfferOrgs = acts => {
  const counts = {}
  const orgs = {}

  acts.forEach(act => {
    if (!act.offerOrg) return
    const id = act.offerOrg._id
    counts[id] = counts[id] ? counts[id] + 1 : 1
    orgs[id] = act.offerOrg
  })
  return [counts, orgs]
}

const ActivityMenu = styled(Menu)`
  height: 32px;
  max-width: 320px;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: -0.3px;
  padding-left: 8px;

  .subheading {
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: -0.2px;
    line-height: 1.1rem;
  }

  background-color: transparent !important;

  .color {
    color: #653cad;
  }

  @media screen and (max-width: 1280px) {
    display: none;
  }
`

const ActMenu = ({ acts, onClick }) => {
  const [counts, orgs] = countOfferOrgs(acts)

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  }

  return (
    <ActivityMenu>
      <Menu
        mode='vertical'
        onClick={onClick}
      >
        <h3>Filter</h3>

        <Radio.Group>
          <Radio style={radioStyle} value={1}>
            Individual
          </Radio>
          <Radio style={radioStyle} value={2}>
            Group
          </Radio>
        </Radio.Group>

        <Menu.ItemGroup key='topics'>
          {Object.keys(orgs).map(key => {
            const org = orgs[key]
            return (
              <Menu.Item key={org._id}>
                {org.name} ({counts[key]})
              </Menu.Item>
            )
          })}
        </Menu.ItemGroup>
        {/* <Menu.ItemGroup className='color'>More filters</Menu.ItemGroup> */}
      </Menu>
    </ActivityMenu>
  )
}

export default ActMenu

// defaultSelectedKeys={selectedKeys}
// defaultOpenKeys={['sub1']}
// mode='horizontal'
// multiple
// selectable
// // onClick={onClick}
