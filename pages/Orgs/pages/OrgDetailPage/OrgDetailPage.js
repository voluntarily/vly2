import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

// Import Style
import styles from '../../components/OrgListItem/OrgListItem.css';

// Import Actions
import { fetchOrg } from '../../OrgActions';

// Import Selectors
import { getOrg } from '../../OrgReducer';

export function OrgDetailPage(props) {
  return (
    <div>
      <Helmet title={props.org.name} />
      <div className={`${styles['single-org']} ${styles['org-detail']}`}>
        <h3 className={styles['org-name']}>{props.org.name}</h3>
        <p className={styles['org.about']}><FormattedMessage id="by" /> {props.org.about}</p>
        <p className={styles['org-desc']}>{props.org.type}</p>
      </div>
    </div>
  );
}

// Actions required to provide data for this component to render in server side.
OrgDetailPage.need = [params => {
  return fetchOrg(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    org: getOrg(state, props.params.cuid),
  };
}

OrgDetailPage.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(OrgDetailPage);
