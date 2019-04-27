import React from 'react';
import PropTypes from 'prop-types';

// Import Components
import OrgListItem from './OrgListItem/OrgListItem';

function OrgList(props) {
  return (
    <div className="listView">
      {
        props.orgs.map(org => (
          <OrgListItem
            org={org}
            key={org.cuid}
            onDelete={() => props.handleDeleteOrg(org.cuid)}
          />
        ))
      }
    </div>
  );
}

OrgList.propTypes = {
  orgs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  })).isRequired,
  handleDeleteOrg: PropTypes.func.isRequired,
};

export default OrgList;
