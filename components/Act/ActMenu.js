import { Menu } from 'antd'
import styled from 'styled-components'

import { useRouter } from 'next/router'
import Link from 'next/link'
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
  width: 240px;
  font-size: 24px;
  font-weight: bold;

  letter-spacing: -0.3px;
  padding-left: 8px;
  .subheading {
    font-size: 1.2rem;
    font-weight: bold;
    letter-spacing: -0.2px;
    line-height: 1.2rem;

  }

  .color {
    color: #653cad;
  }
  @media screen and (max-width: 1280px) {
    display: none;
  }
`

const ActMenu = ({ acts, onClick }) => {
  const [counts, orgs] = countOfferOrgs(acts)
  const router = useRouter()
  return (
    <ActivityMenu>
      <Menu
        mode='vertical'
        onClick={onClick}
      >
        <Menu.ItemGroup key='topics' title='Topics'>
          {Object.keys(orgs).map(key => {
            const org = orgs[key]
            return (
              <Menu.Item key={org._id}>
                {org.name} ({counts[key]})
              </Menu.Item>
            )
          })}

          <Menu.Item key='back'>
            <Link href={`/acts/type/${router.query.type}`}>
              See all
            </Link>
          </Menu.Item>

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
