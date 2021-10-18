import { FormattedMessage } from 'react-intl'
import { config } from '../../config/clientConfig'
import { DocumentList } from '../VTheme/VTheme'
import { SolutionOutlined } from '@ant-design/icons'

export function ActReadMore ({ act }) {
  const kbUrl = `${config.knowledgebaseURL}${act.slug}`
  return (
    <a rel='noopener noreferrer' target='_blank' href={kbUrl}>
      <DocumentList>
        {/* <img src='/static/img/icons/download.svg' alt='an image that shows files being downloaded' /> */}
        <SolutionOutlined style={{ fontSize: '2.5rem' }} />
        <div>
          <p><strong>{act.name}</strong></p>
          <p><FormattedMessage id='ActAboutPanel.readMore' defaultMessage='Read what the experts have to say in our knowledgebase' /></p>
        </div>
      </DocumentList>
    </a>
  )
}
export default ActReadMore
