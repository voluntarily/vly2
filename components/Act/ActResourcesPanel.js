/* Dumb React component Shows contents of an opportunity
 */
import PropTypes from 'prop-types'
import {
  ItemDescription,
  EquipmentList,
  // ItemNeeds,
  ItemSpace
} from '../VTheme/ItemList'
import { ProfilePanel } from '../VTheme/Profile'
import { OpSectionGrid, DocumentList } from '../VTheme/VTheme'
import { Divider } from 'antd'
import { FormattedMessage } from 'react-intl'

export function ActResourcesPanel ({ act }) {
  return (
    <ProfilePanel>
      <OpSectionGrid>
        <div>
          <h2>What you will need</h2>
        </div>
        <ItemDescription>
          <ul>
            <ItemSpace space={act.space} />
          </ul>
          <EquipmentList equipment={act.equipment} />

        </ItemDescription>
      </OpSectionGrid>
      <Divider />

      {act.documents && act.documents.length > 0 && (
        <>
          <OpSectionGrid>
            <div>
              <h2>Documents</h2>
            </div>
            <ItemDescription>
              <ul id='documents'>
                {act.documents.map(document => (
                  <>
                    <a target='_blank' download={document.filename} rel='noopener noreferrer' href={document.location}>
                      <DocumentList key={document.location}>
                        <img src='/static/img/icons/download.svg' alt='an image that shows files being downloaded' />
                        <div>
                          <p><strong>{document.filename}</strong></p>
                          <p><FormattedMessage id='ActResourcesPanel.actFileDescription' defaultMessage='Click to download' description='Instructions for user telling them to download the file' /></p>
                        </div>
                      </DocumentList>
                    </a>

                  </>

                ))}
              </ul>
            </ItemDescription>
          </OpSectionGrid>
          <Divider />
        </>)}
    </ProfilePanel>)
}

ActResourcesPanel.propTypes = {
  act: PropTypes.shape({
    tags: PropTypes.arrayOf(
      PropTypes.string
    ),
    description: PropTypes.string,
    requestor: PropTypes.object
  }).isRequired
}

export default ActResourcesPanel
